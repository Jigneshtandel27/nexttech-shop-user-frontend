import React, { useEffect, useState } from "react";
import "./AddtoCart.css";
import img from "../../assets/img.jpg";
import deleteLogo from "../../assets/icons/delete.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";

const AddtoCart = () => {
  // const [products, setProducts] = useState(
  //   JSON.parse(localStorage.getItem("cart")) || []
  // );

  //   useEffect(() => {
  //     setProducts(JSON.parse(localStorage.getItem("cart")) || []);
  //   }, [localStorage.getItem("cart")]);

  // const emptyCart = (id) => {
  //   localStorage.removeItem(products)
  // };

  const [id, setId] = useState([]);
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // console.log(token);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.BACKEND_URL}/api/cart/allCartData`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const cartItems = response.data.items;
        // console.log(cartItems);
        const productRequests = cartItems.map((value) =>
          axios.get(`${process.env.BACKEND_URL}/api/products/${value.productId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );
        // console.log(productRequests);
        const productResponses = await Promise.all(productRequests);
        // console.log(productResponses);
        const allProducts = productResponses.map((value, index) => ({
          ...value.data.product,
          quantity: cartItems[index].quantity || 1,
        }));
        // console.log(allProducts);
        setProducts(allProducts);
      } catch (error) {
        console.log("Failed to fetch cart data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const removeFromCart = async (id) => {
    try {
      await axios.delete(`${process.env.BACKEND_URL}/api/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filterData = products.filter((value) => value._id !== id);
      setProducts(filterData);
      const removedData = products.filter((value) => value._id === id);
      removedData.map((product) => {
        toast.success(`${product.name} removed from the cart`);
      });
    } catch (error) {
      console.log("Failed to remove", error);
    }
  };

  const decrease = async (id, currentQty) => {
    if (currentQty === 1) {
      removeFromCart(id);
      return;
    }
    const newQty = currentQty - 1;
    try {
      await axios.put(
        `${process.env.BACKEND_URL}/api/cart/${id}`,
        {
          quantity: newQty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedData = products.map((value) =>
        value._id === id ? { ...value, quantity: newQty } : value
      );
      setProducts(updatedData);
    } catch (error) {
      console.log(error);
    }
  };

  const increase = async (id, currentQty, stock) => {
    if (currentQty >= stock) {
      toast.error("Maximum stock reached");
      return;
    }
    const newQty = currentQty + 1;
    try {
      await axios.put(
        `${process.env.BACKEND_URL}/api/cart/${id}`,
        {
          quantity: newQty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedData = products.map((value) =>
        value._id === id ? { ...value, quantity: newQty } : value
      );
      setProducts(updatedData);
    } catch (error) {
      console.log("Failed to update quantity", error);
    }
  };
  const updateQuantity = async (id, newQty) => {
    try {
      if (newQty < 1) return;
      await axios.put(
        `${process.env.BACKEND_URL}/api/cart/${id}`,
        {
          quantity: newQty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedData = products.map((value) =>
        value._id === id ? { ...value, quantity: newQty } : value
      );
      setProducts(updatedData);
    } catch (error) {
      console.log("Failed to update quantity", error);
    }
  };

  const totalPrice = () => {
    let total = 0;
    products.forEach((product) => {
      total += product.price * product.quantity;
    });
    return total;
  };

  return (
    <>
      <main className="addtocart-main">
        <div className="addtocart-container">
          <p className="addtocart-head">Cart</p>
          <div className="addtocart-totalprice">
            <p>
              Total Price :{" "}
              <span className="addtocart-value">
                ₹{totalPrice().toLocaleString("en-In")}
              </span>
            </p>
          </div>
          <button
            className="addtocart-btn"
            onClick={() => {
              if (products.length > 0) {
                navigate("/buy-now");
              } else {
                toast.error("No Products in cart");
              }
            }}
          >
            Buy Now
          </button>

          <section className="addtocart-section">
            {loading ? (
              <Loader />
            ) : products ? (
              products.length > 0 ? (
                products.map((product, index) => (
                  <div className="addtocart-product" key={index}>
                    <img
                      id="addtocart-img"
                      src={`${process.env.BACKEND_URL}/${product.image}`}
                      alt={product.name}
                      onClick={() =>
                        window.open(
                          `${process.env.BACKEND_URL}/${product.image}`,
                          "_blank"
                        )
                      }
                    />
                    <h2 id="addtocart-name">{product.name}</h2>
                    {/* <div id="addtocart-description">
                      {product.description.map((value, i) => (
                        <p key={i}>{value}</p>
                      ))}
                    </div> */}
                    <p className="addtocart-price">
                      Price: ₹
                      <span id="addtocart-price">
                        {(product.price * product.quantity).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </p>
                    <div className="addtocart-quantity">
                      {product.quantity === 1 ? (
                        <button
                          className="addtocart-decrease"
                          onClick={() => removeFromCart(product._id)}
                        >
                          <img
                            id="deleteLogo"
                            src={deleteLogo}
                            alt="deleteLogo"
                          />
                        </button>
                      ) : (
                        <button
                          className="addtocart-decrease"
                          onClick={() =>
                            decrease(product._id, product.quantity)
                          }
                        >
                          -
                        </button>
                      )}

                      <input
                        type="tel"
                        value={product.quantity}
                        onChange={(e) => {
                          let newQty = parseInt(e.target.value) || 1;
                          if (newQty < 1) newQty = 1;
                          if (newQty > product.stock) {
                            toast.error(`Only ${product.stock} in stock`);
                            newQty = product.stock;
                          }
                          updateQuantity(product._id, newQty);
                        }}
                        className="addtocart-quantityNum"
                      />
                      <button
                        className="addtocart-increase"
                        onClick={() =>
                          increase(product._id, product.quantity, product.stock)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="addtocart-remove-btn"
                      onClick={() => removeFromCart(product._id)}
                    >
                      Remove From Cart
                    </button>
                    <Link to="/products">
                      <button className="addtocart-btn">
                        Back to Products
                      </button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="addtocart-emt">
                  <p className="addtocart-empty">Your cart is empty.</p>
                  <Link to="/products">
                    <button className="addtocart-shop-btn">Shop Now</button>
                  </Link>
                </div>
              )
            ) : (
              <Loader />
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default AddtoCart;
