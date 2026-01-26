const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require('dotenv').config()

const app = express();
const port = 3001;
const JWT_SECRET = process.env.JWT_SECRET

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// Middleware for verifying JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]

    if (token == null) {
        return res.sendStatus(401)
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}

// Protected Profile Route
app.get('/profile', verifyToken, (req, res) => {
    const { id, username, email } = req.user

   res.json({ id, username, email })
})

// API Endpoints

// Register Endpoint
app.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (email, username, password) VALUES (?, ?, ?)`;

    connection.query(sql, [email, username, hashedPassword], function(err, result) {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: "Username already exists" });
            }
            return res.status(500).json({ message: "Database error" });
        }

        const userId = result.insertId;

        res.status(201).json({ message: 'User registered successfully', userId: userId })
    })
})

// Login Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT * FROM users WHERE email = ?`;

    connection.query(sql, [email], async(err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '3h' });
        res.json({ message: "Login successful", token })
    })
})

app.listen(port, function () {
    console.log(`Server is running on port ${port}`);
})