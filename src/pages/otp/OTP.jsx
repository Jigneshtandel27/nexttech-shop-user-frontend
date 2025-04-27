import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OTP.css";
import axios from "axios";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";

const OTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("resetEmail");
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true); // Enable resend button when timer reaches 0
    }
  }, [timer]);

  const handleChange = (index, event) => {
    const value = event.target.value;

    // Only allow numbers
    if (!/^\d$/.test(value) && value !== "") return;

    // Copy OTP state and update current index
    let newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // **Navigate when all 6 digits are entered**
    // if (newOtp.every((digit) => digit !== "")) {
    //   setTimeout(() => {
    //     navigate("/Change-pass");
    //   }, 300);
    // }

    // Move focus to the next input if a number is entered
    if (value !== "" && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  // Function to handle Backspace (move focus back)
  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleVerify = async () => {
    const finalOTP = otp.join(""); // Convert array to string

    if (finalOTP.length !== 6) {
      toast.error("Please enter a 6-digit OTP.");
      return;
    }
    try {
      setLoading(true);
      setVerifyLoading(true);
      const response = await axios.post(
        "http://localhost:2000/api/auth/verify-otp",
        {
          email,
          otp: Number(finalOTP),
        }
      );
      if (response.data.success) {
        toast.success("OTP Verified");
        navigate("/Change-pass");
      } else {
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP.");
    } finally {
      setVerifyLoading(false);
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return; // Prevent clicking before timer ends
    try {
      setResendLoading(true);
      const response = await axios.post(
        "http://localhost:2000/api/auth/forgot-password",
        { email }
      );
      if (response.data.success) {
        localStorage.setItem("resetEmail", email);
        toast.success("OTP sent to your email.");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
    setOtp(["", "", "", "", "", ""]); // Clear input fields
    setTimer(30); // Reset timer
    setCanResend(false); // Disable resend button until timer runs out again
  };

  return (
    <>
      <title>OTP Verification</title>
      <main className="otp-main">
        <section className="otp-f1">
          <form className="otp-form1" onSubmit={(e) => e.preventDefault()}>
            <div id="otp-container">
              <h1 className="otp-head">Reset Your Password</h1>
              <p className="otp-text">
                A 6-digit OTP was sent to your email. Enter that code here to
                proceed.
              </p>
            </div>

            <div className="otp-boxes">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-input-${i}`}
                  type="text"
                  className="otp-box"
                  maxLength={1}
                  value={digit}
                  inputMode="numeric"
                  onChange={(e) => handleChange(i, e)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  required
                />
              ))}
            </div>
            <div className="otp-text2">
              {canResend ? (
                <a
                  className="resend-btn"
                  onClick={handleResendOTP}
                  disabled={!canResend || resendLoading}
                >
                  {resendLoading ? "Resending..." : "Resend OTP"}
                </a>
              ) : (
                <p>Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}</p>
              )}
            </div>

            <div className="otp-c1">
              <button
                type="button"
                className="otp-btn"
                onClick={handleVerify}
                disabled={verifyLoading}
              >
                {verifyLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>
        </section>
      </main>
      {loading && <Loader />}
    </>
  );
};

export default OTP;
