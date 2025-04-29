import "./ForgetPass.css";
import emailLogo from "../../assets/icons/mail.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";
const ForgetPass = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const Clicked = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email before proceeding!");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`,
        { email }
      );
      if (response.data.success) {
        localStorage.setItem("resetEmail", email);
        toast.success("OTP sent to your email.");
        navigate("/OTP");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <>
        <title>Password Reset</title>
        <main className="forget-main">
          <section className="forget-f1">
            <form className="forget-form1">
              <div id="forget-container">
                <h1 className="forget-head">Forgot Password</h1>
                <p className="forget-text">
                  {" "}
                  Enter your e-mail address below, and we'll send an OTP to your
                  email to verify it. OTP is valid for 24hrs only.
                </p>
              </div>
              <div className="forget-icon1">
                <input
                  className="forget-input"
                  type="email"
                  placeholder="Enter Your Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <br />
                <img className="forget-icon" src={emailLogo} alt="logo" />
                <br />
              </div>

              <div className="forget-c1">
                <button
                  className="forget-btn"
                  onClick={Clicked}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
                {/* <button className="forget-btn">Send OTP</button> */}
                <br />
              </div>
            </form>
          </section>
        </main>
        {loading && <Loader />}
      </>
    </>
  );
};

export default ForgetPass;
