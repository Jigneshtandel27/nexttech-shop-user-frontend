import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Registration.css";
import nameLogo from "../../assets/icons/name.png";
import emailLogo from "../../assets/icons/mail.png";
import callLogo from "../../assets/icons/call.png";
import passLogo from "../../assets/icons/pass.png";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormdata] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const Change = (event) => {
    const { name, value } = event.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const Submit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/register`,
        {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
        }
      );
      toast.success(response.data.msg);
      setFormdata({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
      });
      navigate("/login");
    } catch (error) {
      toast.error(error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
    // let users = JSON.parse(localStorage.getItem("users")) || [];
    // users.push(formData);
    // localStorage.setItem("users", JSON.stringify(users));
    // toast.success("Registered Successfully");
  };

  return (
    <>
      <title>Registration Page</title>
      <main className="register-main">
        <section className="register-f1">
          <form className="register-form1" onSubmit={Submit}>
            <h1 id="register-head">Create Account</h1>
            <div className="register-f2">
              <div className="register-input-container">
                <input
                  className="register-input"
                  type="text"
                  name="name"
                  placeholder="Enter Your Name"
                  value={formData.name}
                  onChange={Change}
                  required
                />
                <i className="register-icon">
                  <img className="register-img1" src={nameLogo} alt="img" />
                </i>
              </div>
              <div className="register-input-container">
                <input
                  className="register-input"
                  type="email"
                  name="email"
                  placeholder="Enter Your Email"
                  value={formData.email}
                  onChange={Change}
                  required
                />
                <i className="register-icon">
                  <img className="register-img2" src={emailLogo} alt="img" />
                </i>
              </div>
              <div className="register-input-container">
                <input
                  className="register-input"
                  type="tel"
                  name="mobile"
                  placeholder="Enter Your Mobile No."
                  value={formData.mobile}
                  onChange={Change}
                  required
                />
                <i className="register-icon">
                  <img className="register-img3" src={callLogo} alt="img" />
                </i>
              </div>
              <div className="register-input-container">
                <input
                  className="register-input"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Your Password"
                  value={formData.password}
                  onChange={Change}
                  required
                />
                <i className="register-icon">
                  <img
                    className="register-img4"
                    src={passLogo}
                    alt="img"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </i>
              </div>
              <div className="register-input-container">
                <input
                  className="register-input"
                  type={showPassword1 ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-Enter Your Password"
                  value={formData.confirmPassword}
                  onChange={Change}
                  required
                />
                <i className="register-icon">
                  <img
                    className="register-img4"
                    src={passLogo}
                    alt="img"
                    onClick={() => setShowPassword1(!showPassword1)}
                  />
                </i>
              </div>
              <div className="register-c1">
                <button className="register-btn">Sign Up</button>
                <br />
                <Link className="register-a1" to="/login">
                  Have already an account? <b>Login Here</b>
                </Link>
              </div>
            </div>
          </form>
        </section>
      </main>
      {loading && <Loader />}
    </>
  );
};

export default Registration;
