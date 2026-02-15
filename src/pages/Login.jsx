import { useState } from "react";
import "../styles/Login.css";
import emailLogo from "/assets/icons/mail.png";
import passLogo from "/assets/icons/pass.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLogindata] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const Change = (event) => {
    const { name, value } = event.target;
    setLogindata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const Submit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        {
          email: loginData.email,
          password: loginData.password,
        },
      );
      toast.success(response.data.msg);
      localStorage.setItem("token", response.data.Token);
      setLogindata({
        email: "",
        password: "",
      });
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }

    //   const register = JSON.parse(localStorage.getItem("users"));

    //   if (!register || register.length === 0) {
    //     alert("No registered users found. Please register first.");
    //     return;
    //   }

    //   const foundUser = register.find(
    //     (user) => user.email === loginData.email && user.password === loginData.password
    //   );

    //   if (foundUser) {
    //   alert("Login Successful!");
    //   navigate("/");
    // } else {
    //   alert("Invalid Email or Password");
    // }
  };

  return (
    <>
      <title>Login Page</title>
      <main className="login-main">
        <section className="login-f1">
          <form className="login-form1" onSubmit={Submit}>
            <div id="login-head">
              <h1>Login</h1>
            </div>

            {/* Email Input */}
            <div className="login-icon1">
              <input
                className="login-input"
                type="email"
                name="email"
                placeholder="Enter Your Email Address"
                value={loginData.email}
                onChange={Change}
                required
              />
              <img className="login-icon" src={emailLogo} alt="Email Icon" />
            </div>

            {/* Password Input */}
            <div className="login-icon1">
              <input
                className="login-input"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Your Password"
                value={loginData.password}
                onChange={Change}
                required
              />
              <img
                id="login-pass"
                className="login-icon"
                src={passLogo}
                alt="Password Icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="login-c2">
              {/* <label className="login-remember">
                <input className="login-input1" type="checkbox" />
                Remember me
              </label> */}
              <Link className="login-a2" to="/forget-pass">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <div className="login-c1">
              <button type="submit" className="login-btn">
                Login
              </button>
              <Link className="login-a1" to="/registration">
                Don't have an account? <b>Register</b>
              </Link>
            </div>
          </form>
        </section>
      </main>
      {loading && <Loader />}
    </>
  );
};

export default Login;
