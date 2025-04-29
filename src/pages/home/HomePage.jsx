import React, { useEffect, useState } from "react";
import "./HomePage.css";
import banner1 from "../../assets/images/razer-blade-16.mp4";
import banner2 from "../../assets/images/razer-blade-18.mp4";
import gaming from "../../assets/laptops/gaming.png";
import business from "../../assets/laptops/business.png";
import student from "../../assets/laptops/student.png";
import twoinone from "../../assets/laptops/twoinone.png";
import ultrabook from "../../assets/laptops/ultrabook.png";
import asus from "../../assets/logo/Asus-rog-logo.svg";
import msi from "../../assets/logo/msi.png";
import lenovo from "../../assets/logo/lenovo.png";
import hp from "../../assets/logo/hp-logo.png";
import acer from "../../assets/logo/Acer-Predator.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";

const laptop = [
  {
    image: gaming,
    category: "Gaming",
  },
  {
    image: business,
    category: "Business",
  },
  {
    image: student,
    category: "Student",
  },
  {
    image: ultrabook,
    category: "Ultrabook",
  },
  {
    image: twoinone,
    category: "TwoInOne",
  },
];

const logo = [
  { image: lenovo },
  { image: msi },
  { image: asus },
  { image: acer },
  { image: hp },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const seeDetails = (product) => {
    navigate("/more-details", { state: { product } });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const Product = response.data.products.slice(0, 8);
        setProducts(Product);
        // console.log(Product);
        // console.log(response.data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="homepage">
      {/* Hero Banner */}
      <section className="hero-video">
        <video className="banner-video" autoPlay muted playsInline>
          <source src={banner1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <video className="banner-video" autoPlay muted playsInline>
          <source src={banner2} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      {/* Category Section */}
      <section className="categories">
        <p className="category-heading">Choose Your Category</p>
        <div className="category-list">
          {laptop.map((value, index) => (
            <div
              className="category"
              key={index}
              onClick={() =>
                navigate("/products", { state: { category: value.category } })
              }
            >
              <img
                className="category-img"
                src={value.image}
                alt={value.category}
              />
              <p className="category-name">{value.category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Highly Recommended Section */}
      {/* <section className="recommended">
        <p className="recommend-heading">Highly Recommended</p>
        <div className="product-list">
          {productsData.recommended.map((product) => (
            <div className="product" key={product.id}>
              <img src={banner2} alt={product.name} />
              <p className="recommend-name">{product.name}</p>
              <p className="recommend-name">{product.price}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* Best Selling Products */}
      <section className="best-selling">
        <p className="selling-heading">Best Selling Products</p>
        <div className="selling-list">
          {loading ? (
            <Loader />
          ) : (
            products.map((product) => (
              <div
                onClick={() => seeDetails(product)}
                className="selling-product"
                key={product._id}
              >
                <img
                  className="selling-img"
                  src={`${import.meta.env.VITE_BACKEND_URL}/${product.image}`}
                  alt={product.name}
                />
                <p className="selling-name">{product.name}</p>
                <p className="selling-price">
                  ₹ {product.price.toLocaleString("en-IN")}
                </p>
              </div>
            ))
          )}
        </div>
        <button
          className="selling-button"
          onClick={() => navigate("/products")}
        >
          View More Products
        </button>
      </section>

      {/* Company Logo */}
      <section className="company-logo">
        {logo.map((logo, index) => (
          <img key={index} src={logo.image} alt="Company Logo" />
        ))}
      </section>

      {/* Customer Reviews */}
      {/* <section className="customer-reviews">
        <h2>Customer Reviews</h2>
        <div className="reviews">
          {[
            '"Great quality!" - Customer 1',
            '"Fast delivery!" - Customer 2',
            '"Highly recommend!" - Customer 3',
          ].map((review, index) => (
            <div className="review" key={index}>
              {review}
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
};

export default HomePage;
