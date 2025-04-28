import React, { useState } from "react";
import "./Detailspage.css";
// import img from "../../assets/img.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";

const Detailspage = () => {
  // const product = JSON.parse(localStorage.getItem("detail"));
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const addtoCart = async (product) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/cart`,
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Product added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart", error);
    } finally {
      setLoading(false);
    }
  };

  const buyNow = (product) => {
    navigate("/buy-now", { state: { product } });
  };
  return (
    <>
      <main className="details-main">
        <section className="details-section">
          <p className="details-heading">Product Details</p>
          <div className="details-container">
            <img
              id="details-img"
              src={`${process.env.REACT_APP_BACKEND_URL}/${product.image}`}
              alt={product.name}
              onClick={() =>
                window.open(`${process.env.REACT_APP_BACKEND_URL}/${product.image}`, "_blank")
              }
            />
            <div className="details-data">
              <p id="details-name">{product.name}</p>
              <div id="details-description">
                {product.description.length > 0 &&
                  product.description[0].split(",").map((value, index) => {
                    return (
                      <ul className="details-points" key={index}>
                        <li>{value.trim()}</li>
                      </ul>
                    );
                  })}
              </div>
              <p className="details-price-box">
                Price: ₹
                <span id="details-price">
                  {product.price.toLocaleString("en-IN")}
                </span>
                <s className="details-dashed-price">
                  ₹{(product.price + 20000).toLocaleString("en-IN")}
                </s>
              </p>
              <p className="details-buy-btn" onClick={() => buyNow(product)}>
                Buy Now
              </p>
              <button
                onClick={() => addtoCart(product)}
                className="details-add-btn"
              >
                Add to Cart
              </button>

              <Link to="/products" className="details-btn">
                Back to Products
              </Link>
            </div>
          </div>
        </section>
      </main>
      {loading && <Loader />}
    </>
  );
};

export default Detailspage;
