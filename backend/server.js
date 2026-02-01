const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
require("dotenv").config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null, fileName)
  }
})

const upload = multer({
   storage,
   limits: {
    fileSize: 1024 * 1024 * 20
   },
   fileFilter: (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('File type not supported'), false)
    }
   }
})

const app = express();
const port = 3001;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 นาที
  max: 5,                  // 5 ครั้ง
  message: {
    message: "คุณพยายามมากเกินไป กรุณารอ 10 นาที",
  },
});

// Middleware for verifying JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Protected Profile Route
app.get("/profile", verifyToken, (req, res) => {
  const { id, username, email } = req.user;

  res.json({ id, username, email });
});

// API Endpoints

// กำหนดเวลาหมดอายุของ OTP
const OTP_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes

// File Upload Endpoint
app.post('/upload', (req, res) => {
  upload.array('files', 10)(req, res, (err) => {
    if (err) {
      console.error(err)
      return res.status(400).json({ message: err.message })
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    }))

    res.status(200).json({
      message: 'Upload success',
      files
    })
  })
})

// Send OTP Endpoint
app.post("/sendOTP", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // เช็คว่ามีอีเมลนี้อยู่ในระบบหรือยัง
    const checkEmailSql = `SELECT * FROM users WHERE email = ?`;
    const emailCheckResult = await new Promise((resolve, reject) => {
      connection.query(checkEmailSql, [email], function (err, result) {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (Array.isArray(emailCheckResult) && emailCheckResult.length !== 0) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    // ลบ OTP เก่าออกก่อนส่ง OTP ใหม่
    const deleteOldOtpSql = `DELETE FROM otp_verifications WHERE email = ?`;
    await new Promise((resolve, reject) => {
      connection.query(deleteOldOtpSql, [email], function (err) {
        if (err) {
          console.error("Error deleting old OTP:", err);
        }
        resolve(null);
      });
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // บันทึก OTP พร้อมกับเวลาหมดอายุ
    const expiresAt = new Date(Date.now() + OTP_EXPIRATION_TIME);
    const insertOtpSql = `INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?, ?, ?)`;
    await new Promise((resolve, reject) => {
      connection.query(
        insertOtpSql,
        [email, otp, expiresAt],
        function (err, result) {
          if (err) {
            console.error("Error storing OTP:", err);
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    // ส่งอีเมลกับ OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "รหัส OTP สำหรับเว็บไซต์ - SAVEPortfolio",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h1 style="color: #6c63ff; text-align: center; margin-bottom: 30px;">SAVEPortfolio</h1>
                    <h2 style="color: #333; text-align: center; margin-bottom: 20px;">รหัส OTP สำหรับ SAVEPortfolio</h2>
                    <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        สวัสดีครับ
                    </p>
                    <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                        รหัส OTP ของคุณคือ:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <div style="display: inline-block; background: linear-gradient(135deg, #6c63ff 0%, #00f2ff 100%); color: white; padding: 15px 40px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
                            ${otp}
                        </div>
                    </div>
                    <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                        รหัสนี้จะหมดอายุใน 10 นาที
                    </p>
                    <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
                        หากคุณไม่ได้ทำการสมัครสมาชิกหรือกู้คืนรหัสผ่านด้วยตัวเอง กรุณาเพิกเฉยต่ออีเมลนี้
                    </p>
                </div>
            </div>
        `,
    };

    // ส่งอีเมลกับ OTP
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent successfully:", info.messageId);
      }
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error in sendOTP:", err);
    if (!res.headersSent) {
      if (err.code === "ER_NO_SUCH_TABLE") {
        return res.status(500).json({ 
          message: "Database table not found. Please run the SQL script to create otp_verifications table." 
        });
      }
      return res.status(500).json({ message: "Failed to send OTP" });
    }
  }
});

// Send OTP Endpoint for Recovery
app.post("/sendOTP-recovery", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // เช็คว่ามีอีเมลนี้อยู่ในระบบหรือยัง
    const checkEmailSql = `SELECT * FROM users WHERE email = ?`;
    const emailCheckResult = await new Promise((resolve, reject) => {
      connection.query(checkEmailSql, [email], function (err, result) {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (Array.isArray(emailCheckResult) && emailCheckResult.length === 0) {
      return res.status(409).json({ message: "ไม่พบอีเมลนี้ในระบบ" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ลบ OTP เก่าออกก่อนส่ง OTP ใหม่
    const deleteOldOtpSql = `DELETE FROM otp_verifications WHERE email = ?`;
    await new Promise((resolve, reject) => {
      connection.query(deleteOldOtpSql, [email], function (err) {
        if (err) {
          console.error("Error deleting old OTP:", err);
        }
        resolve(null);
      });
    });

    // บันทึก OTP พร้อมกับเวลาหมดอายุ
    const expiresAt = new Date(Date.now() + OTP_EXPIRATION_TIME);
    const insertOtpSql = `INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?, ?, ?)`;
    await new Promise((resolve, reject) => {
      connection.query(
        insertOtpSql,
        [email, otp, expiresAt],
        function (err, result) {
          if (err) {
            console.error("Error storing OTP:", err);
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    // ส่งอีเมลกับ OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "รหัส OTP สำหรับเว็บไซต์ - SAVEPortfolio",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h1 style="color: #6c63ff; text-align: center; margin-bottom: 30px;">SAVEPortfolio</h1>
                    <h2 style="color: #333; text-align: center; margin-bottom: 20px;">รหัส OTP สำหรับ SAVEPortfolio</h2>
                    <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        สวัสดีครับ
                    </p>
                    <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                        รหัส OTP ของคุณคือ:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <div style="display: inline-block; background: linear-gradient(135deg, #6c63ff 0%, #00f2ff 100%); color: white; padding: 15px 40px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
                            ${otp}
                        </div>
                    </div>
                    <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                        รหัสนี้จะหมดอายุใน 10 นาที
                    </p>
                    <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
                        หากคุณไม่ได้ทำการสมัครสมาชิกหรือกู้คืนรหัสผ่านด้วยตัวเอง กรุณาเพิกเฉยต่ออีเมลนี้
                    </p>
                </div>
            </div>
        `,
    };

    // ส่งอีเมลกับ OTP
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent successfully:", info.messageId);
      }
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error in sendOTP:", err);
    if (!res.headersSent) {
      if (err.code === "ER_NO_SUCH_TABLE") {
        return res.status(500).json({ 
          message: "Database table not found. Please run the SQL script to create otp_verifications table." 
        });
      }
      return res.status(500).json({ message: "Failed to send OTP" });
    }
  }
});

// Verify OTP Endpoint (ใช้กับการสมัครสมาชิก)
app.post("/verifyOTP", otpLimiter, async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const sql = `SELECT * FROM otp_verifications WHERE email = ? AND otp = ?`;
  connection.query(sql, [email, otp], function (err, result) {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "รหัส OTP ไม่ถูกต้อง" });
    }

    const otpRecord = result[0];
    const expiresAt = new Date(otpRecord.expires_at);
    const now = new Date();

    // เช็คว่า OTP หมดอายุหรือยัง
    if (now > expiresAt) {
      // ลบ OTP ที่หมดอายุ
      const deleteSql = `DELETE FROM otp_verifications WHERE email = ?`;
      connection.query(deleteSql, [email], function (err) {
        if (err) {
          console.error("Error deleting expired OTP:", err);
        }
      });
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // ลบ OTP ที่ใช้แล้ว
    const deleteSql = `DELETE FROM otp_verifications WHERE email = ? AND otp = ?`;
    connection.query(deleteSql, [email, otp], function (err) {
      if (err) {
        console.error("Error deleting OTP:", err);
      }
    });

    res.status(200).json({ message: "ยืนยัน OTP สำเร็จ" });
  });
});

// Verify OTP Endpoint สำหรับกู้คืนรหัสผ่าน (สร้าง reset token)
app.post("/verifyOTP-recovery", otpLimiter, async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const sql = `SELECT * FROM otp_verifications WHERE email = ? AND otp = ?`;
  connection.query(sql, [email, otp], function (err, result) {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "รหัส OTP ไม่ถูกต้อง" });
    }

    const otpRecord = result[0];
    const expiresAt = new Date(otpRecord.expires_at);
    const now = new Date();

    // เช็คว่า OTP หมดอายุหรือยัง
    if (now > expiresAt) {
      // ลบ OTP ที่หมดอายุ
      const deleteSql = `DELETE FROM otp_verifications WHERE email = ?`;
      connection.query(deleteSql, [email], function (err) {
        if (err) {
          console.error("Error deleting expired OTP:", err);
        }
      });
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // ลบ OTP ที่ใช้แล้ว
    const deleteSql = `DELETE FROM otp_verifications WHERE email = ? AND otp = ?`;
    connection.query(deleteSql, [email, otp], function (err) {
      if (err) {
        console.error("Error deleting OTP:", err);
      }
    });

    // สร้าง reset token แบบ JWT สำหรับใช้รีเซ็ตรหัสผ่าน
    const resetToken = jwt.sign(
      { email, purpose: "password_reset" },
      JWT_SECRET,
      { expiresIn: "10m" },
    );

    res.status(200).json({ message: "ยืนยัน OTP สำเร็จ", resetToken });
  });
});

// Reset Password Endpoint
app.post("/reset-password", otpLimiter, async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (!payload || payload.purpose !== "password_reset" || !payload.email) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    const email = payload.email;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const sql = `UPDATE users SET password = ? WHERE email = ?`;
    connection.query(sql, [hashedPassword, email], function (err, result) {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
      }

      res.status(200).json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
    });
  } catch (err) {
    console.error("Error in reset-password:", err);
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }
});

// Register Endpoint
app.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = `INSERT INTO users (email, username, password) VALUES (?, ?, ?)`;

  connection.query(
    sql,
    [email, username, hashedPassword],
    function (err, result) {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Username already exists" });
        }
        return res.status(500).json({ message: "Database error" });
      }

      const userId = result.insertId;

      res
        .status(201)
        .json({ message: "User registered successfully", userId: userId });
    },
  );
});

// Login Endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = ?`;

  connection.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "ไม่พบอีเมลนี้ในระบบ" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "3h" },
    );
    res.json({ message: "Login successful", token, username: user.username });
  });
});

// ลบ OTP ที่หมดอายุทุก 5 นาที
setInterval(() => {
  const deleteExpiredSql = `DELETE FROM otp_verifications WHERE expires_at < NOW()`;
  connection.query(deleteExpiredSql, function (err, result) {
    if (err) {
      console.error("Error cleaning up expired OTPs:", err);
    } else if (result.affectedRows > 0) {
      console.log(`Cleaned up ${result.affectedRows} expired OTP(s)`);
    }
  });
}, 5 * 60 * 1000);

app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
  console.log(`OTP expiration time: ${OTP_EXPIRATION_TIME / 1000 / 60} minutes`);
});
