import React, { useEffect, useState } from "react";
import "./BuyNow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";

const BuyNow = () => {
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const product1 = location.state?.product;

  useEffect(() => {
    if (product1) {
      setProduct([{ ...product1, quantity: 1 }]);
    } else {
      setLoading(true);
      const fetchData = async () => {
        try {
          setLoading(true);

          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/cart/allCartData`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const cartItem = response.data.items;

          const productRequest = cartItem.map((value) =>
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products/${value.productId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          );
          const productResponse = await Promise.all(productRequest);

          const allProducts = productResponse.map((value, index) => ({
            ...value.data.product,
            quantity: cartItem[index].quantity,
          }));
          setProduct(allProducts);
        } catch (error) {
          console.log("Error fetching cart for checkout", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [token, product1]);

  const [quantity, setQuantity] = useState(1);
  const [formData1, setformData1] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("DebitCard");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
  });
  const [upiId, setUpiId] = useState("");

  const handleChange = (e) =>
    setformData1({ ...formData1, [e.target.name]: e.target.value });
  const handleCardChange = (e) =>
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (product.length === 0) {
      toast.error("No product found to place an order.");
      return false;
    }
    if (
      !formData1.name ||
      !formData1.email ||
      !formData1.address ||
      !formData1.phone
    ) {
      toast.error("Please fill all shipping details.");
      return false;
    }

    // if (!/^\d{10}$/.test(formData1.phone)) {
    //   toast.error("Please enter a valid 10-digit phone number.");
    //   return false;
    // }

    if (paymentMethod === "UPI" && upiId.trim() === "") {
      toast.error("Please enter your UPI ID or scan the QR code.");
      return false;
    }

    if (
      (paymentMethod === "CreditCard" || paymentMethod === "DebitCard") &&
      (!cardDetails.cardNumber ||
        !cardDetails.expiryDate ||
        !cardDetails.cvv ||
        !cardDetails.cardHolderName)
    ) {
      toast.error("Please fill all card details.");
      return false;
    }

    if (
      (paymentMethod === "CreditCard" || paymentMethod === "DebitCard") &&
      !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate)
    ) {
      toast.error("Please enter a valid expiry date (MM/YY).");
      return false;
    }

    return true;
  };

  const placeOrder = async () => {
    try {
      setLoading(true);
      const orderData = {
        shippingDetails: formData1,
        paymentMethod,
        products: product.map((value) => ({
          productId: value._id,
          name: value.name,
          image: value.image,
          quantity: value.quantity,
          price: value.price,
        })),
        totalAmount: totalPrice,
      };
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/order`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Order placed successfully!");
      navigate("/products");
    } catch (error) {
      console.log("Error placing order", error);
      toast.error("Something went wrong while placing the order.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (!validateForm()) return;

    placeOrder();
  };

  let totalPrice = 0;
  product.forEach((value) => {
    totalPrice += value.price * value.quantity;
  });

  return (
    <div className="buy-now-container">
      <div className="buy-now-product-details">
        <div className="buy-now-product-container">
          {loading ? (
            <Loader />
          ) : product.length > 0 ? (
            product.map((product) => (
              <div className="buy-now-product" key={product._id}>
                <div className="buy-now-img-container">
                  <img
                    className="buy-now-product-img"
                    src={`${process.env.REACT_APP_BACKEND_URL}/${product.image}`}
                    onClick={() =>
                      window.open(
                        `${process.env.REACT_APP_BACKEND_URL}/${product.image}`,
                        "_blank"
                      )
                    }
                    alt="Laptop"
                  />
                </div>
                <h2 className="buy-now-product-name">{product.name}</h2>
                <div className="product-price-container">
                  <p className="buy-now-price">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                  <s className="product-dashed-price">
                    ₹{(product.price + 20000).toLocaleString("en-IN")}
                  </s>
                </div>
                <p className="buy-now-quantity">Quantity: {product.quantity}</p>
                <p className="buy-now-stock">
                  Only {product.stock} left in stock.
                </p>
                <p className="buy-now-individual-price">
                  Total Price:{" "}
                  {(product.price * product.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            ))
          ) : (
            <p style={{ color: "white", padding: "20px" }}>
              No products found for checkout.
            </p>
          )}
        </div>
        <p className="buy-now-total-price">
          Total Price: ₹{totalPrice.toLocaleString("en-IN")}{" "}
          <s className="buy-now-total-dashedprice">
            ₹{(totalPrice + product.length * 20000).toLocaleString("en-IN")}
          </s>
        </p>
      </div>

      <div className="buy-now-alldetails">
        <div className="buy-now-user-info">
          <h3>Shipping Details</h3>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData1.name}
            onChange={handleChange}
            className="buy-now-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData1.email}
            onChange={handleChange}
            className="buy-now-input"
          />
          <input
            type="text"
            name="address"
            placeholder="Your Address"
            value={formData1.address}
            onChange={handleChange}
            className="buy-now-input"
          />
          <input
            type="text"
            name="phone"
            placeholder="Your Phone Number"
            value={formData1.phone}
            onChange={handleChange}
            className="buy-now-input"
          />
        </div>

        <div className="buy-now-payment-section">
          <h3>Select Payment Method</h3>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="buy-now-input"
          >
            <option className="buy-now-option" value="UPI">
              UPI Payment
            </option>
            <option className="buy-now-option" value="COD">
              Cash on Delivery
            </option>
            <option className="buy-now-option" value="DebitCard">
              Debit Card
            </option>
            <option className="buy-now-option" value="CreditCard">
              Credit Card
            </option>
          </select>

          {paymentMethod === "UPI" && (
            <div className="buy-now-upi-details">
              <img
                src="/images/qr-code.png"
                alt="UPI QR Code"
                className="buy-now-qr-code"
              />
              <input
                type="text"
                placeholder="Enter UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="buy-now-input"
              />
            </div>
          )}

          {(paymentMethod === "DebitCard" ||
            paymentMethod === "CreditCard") && (
            <div className="buy-now-card-details">
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={cardDetails.cardNumber}
                onChange={handleCardChange}
                className="buy-now-input"
              />
              <input
                type="text"
                name="expiryDate"
                placeholder="Expiry Date (MM/YY)"
                value={cardDetails.expiryDate}
                onChange={handleCardChange}
                className="buy-now-input"
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={cardDetails.cvv}
                onChange={handleCardChange}
                className="buy-now-input"
              />
              <input
                type="text"
                name="cardHolderName"
                placeholder="Card Holder Name"
                value={cardDetails.cardHolderName}
                onChange={handleCardChange}
                className="buy-now-input"
              />
            </div>
          )}

          <button className="buy-now-btn" onClick={handlePayment}>
            {paymentMethod === "COD" ? "Place Order" : "Proceed to Payment"}
          </button>
        </div>
      </div>
      {loading && <Loader />}
    </div>
  );
};

export default BuyNow;
