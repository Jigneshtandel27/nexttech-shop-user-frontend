import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Project from "./Project";
import Detailspage from "./pages/Detailspage";
import AddtoCart from "./pages/AddtoCart";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ForgetPass from "./pages/ForgetPass";
import ChangePass from "./pages/ChangePass";
import OTP from "./pages/OTP";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Service from "./pages/Service";
import BuyNow from "./pages/BuyNow";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./pages/ProtectedRoute";
import ProductProvider from "./context/ProductContext";
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
          <Route path="/" element={<Project />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<Product />} />
            <Route path="services" element={<Service />} />
            <Route path="contact" element={<Contact />} />
            <Route path="more-details" element={<Detailspage />} />
            <Route
              path="addtocart"
              element={<ProtectedRoute element={<AddtoCart />} />}
            />
            <Route
              path="buy-now"
              element={<ProtectedRoute element={<BuyNow />} />}
            />

            {/* <Route path="wishlist" element={<Wishlist />} /> */}
          </Route>
        </Routes>
        <ToastContainer position="top-center" autoClose={3000}></ToastContainer>
      </BrowserRouter>
    </ProductProvider>
  </StrictMode>,
);
