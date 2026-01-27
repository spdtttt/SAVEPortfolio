import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { BarLoader } from "react-spinners";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const OtpVerify = lazy(() => import("../pages/otpVerify"));
const SendEmailOTP = lazy(() => import("../pages/sendEmailOTP"));
const OtpVerifyRecovery = lazy(() => import("../pages/otpVerifyRecovery"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const Profile = lazy(() => import("../pages/Profile"));

import Layout from "../Layout";
import ProtectedRoute from "../ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="flex items-center justify-center p-12 bg-[#0f172a] bg-[radial-gradient(at_0%_0%,rgba(108,99,255,0.15)_0px,transparent_50%),radial-gradient(at_100%_0%,rgba(0,242,255,0.15)_0px,transparent_50%),radial-gradient(at_100%_100%,rgba(108,99,255,0.15)_0px,transparent_50%),radial-gradient(at_0%_100%,rgba(0,242,255,0.15)_0px,transparent_50%)] h-screen">
          <BarLoader height={6} width={200} color="white" />
        </div>
      }>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />
          <Route
            path="/otp-verify"
            element={
              <Layout>
                <OtpVerify />
              </Layout>
            }
          />
          <Route
            path="/send-email-otp"
            element={
              <Layout>
                <SendEmailOTP />
              </Layout>
            }
          />
          <Route
            path="/send-email-otp/otp-verify-recovery"
            element={
              <Layout>
                <OtpVerifyRecovery />
              </Layout>
            }
          />
          <Route
            path="/reset-password"
            element={
              <Layout>
                <ResetPassword />
              </Layout>
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
