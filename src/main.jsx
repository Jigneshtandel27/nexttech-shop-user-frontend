import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Project from "./Project";
import Detailspage from "./pages/details/Detailspage";
import AddtoCart from "./pages/addtocart/AddtoCart";
import Login from "./pages/login/Login";
import Registration from "./pages/registration/Registration";
import ForgetPass from "./pages/forget-pass/ForgetPass";
import ChangePass from "./pages/changepass/ChangePass";
import OTP from "./pages/otp/OTP";
import Contact from "./pages/contact/Contact";
import Product from "./pages/product/Product";
import Service from "./pages/service/Service";
import BuyNow from "./pages/buy-now/BuyNow";
import HomePage from "./pages/home/HomePage";
import ProtectedRoute from "./pages/ProtectedRoute";
import ProductProvider from "./pages/context/ProductContext";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProductProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/forget-pass" element={<ForgetPass />} />
          <Route path="/change-pass" element={<ChangePass />} />
          <Route path="/OTP" element={<OTP />} />
          <Route path="" element={<Project />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<Product />} />
            <Route path="/services" element={<Service />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/addtocart"
              element={<ProtectedRoute element={<AddtoCart />} />}
            />
            <Route
              path="/more-details"
              element={<ProtectedRoute element={<Detailspage />} />}
            />
            <Route
              path="/buy-now"
              element={<ProtectedRoute element={<BuyNow />} />}
            />
            {/* <Route path="/wishlist" element={<Wishlist />} /> */}
            {/* <Route path="/" element={}/> */}
          </Route>
        </Routes>
        <ToastContainer position="top-center" autoClose={3000}></ToastContainer>
      </BrowserRouter>
    </ProductProvider>
  </StrictMode>
);
