import React, { useState } from "react";
import "./Contact.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const change = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (token) {
      try {
        await axios.post(`${process.env.BACKEND_URL}/api/contact`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Form submitted successfully!");
        setData({});
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error in form submission"
        );
      }
    } else {
      toast.error("Please Log In first");
      navigate("/login");
    }
  };

  return (
    <div>
      <main className="contact-main">
        <p className="contact-heading">Contact Form</p>
        <section id="contact-form">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div id="contact-form1">
              <label className="contact-lable" htmlFor="name">
                Name:
              </label>
              <input
                onChange={change}
                value={data.name || ""}
                className="contact-input"
                type="text"
                name="name"
                id="contact-name"
                required
              />
              <label className="contact-lable" htmlFor="email">
                Email:
              </label>
              <input
                onChange={change}
                value={data.email || ""}
                className="contact-input"
                type="email"
                name="email"
                id="contact-email"
                required
              />
              <label className="contact-lable" htmlFor="message">
                Message:
              </label>
              <textarea
                onChange={change}
                value={data.message || ""}
                className="contact-message"
                name="message"
                id="contact-message"
                required
              />
              <button className="contact-form-submit" type="submit">
                Submit
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Contact;
