import { useState } from "react";
import "./ChangePass.css";
import passLogo from "../../assets/icons/pass.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";

const ChangePass = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const email = localStorage.getItem("resetEmail");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.BACKEND_URL}/api/auth/reset-password`,
        { email, newPassword: password }
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );
      if (response.data.success) {
        toast.success(response.data.message || "Password changed successfully!");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        error.response?.data?.message || "Failed to change password. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Change Password</title>
      <main className="changePass-main">
        <section className="changePass-f1">
          <form className="changePass-form1" onSubmit={handleSubmit}>
            <div id="changePass-head">
              <h1>Change Password</h1>
            </div>

            {/* New Password Field */}
            <label className="changePass-lable" htmlFor="new-password">
              New Password
            </label>
            <br />
            <div className="changePass-icon1">
              <input
                className="changePass-input"
                type={showPassword ? "text" : "password"}
                id="new-password"
                placeholder="Enter New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img
                className="changePass-icon"
                src={passLogo}
                alt="logo"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                style={{ cursor: "pointer" }}
              />
              <br />
            </div>

            {/* Confirm Password Field */}
            <label className="changePass-lable" htmlFor="confirm-password">
              Confirm Password
            </label>
            <br />
            <div className="changePass-icon1">
              <input
                className="changePass-input"
                type={showPassword1 ? "text" : "password"}
                id="confirm-password"
                placeholder="Re-Enter New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <img
                className="changePass-icon"
                src={passLogo}
                alt="logo"
                onClick={() => setShowPassword1(!showPassword1)} // Toggle password visibility
              />
              <br />
            </div>

            {/* Submit Button */}
            <div className="changePass-c1">
              <button type="submit" className="changePass-btn">
                Submit
              </button>
            </div>
          </form>
        </section>
      </main>
      {loading && <Loader />}
    </>
  );
};

export default ChangePass;
