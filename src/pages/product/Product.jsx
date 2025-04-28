import React, { useContext } from "react";
import "./Product.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import wishlistLogo from "../../assets/icons/wishlist.png";
// import products from "../../data/products.json";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../loader/Loader";
import { ProductContext } from "../context/ProductContext";
import { toast } from "react-toastify";

const Product = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const category = location.state?.category || null;

  // console.log(category);
  const productsPerPage = 15;

  const { filteredProducts } = useContext(ProductContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/products`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const filtered = category
          ? response.data.products.filter(
              (product) => product.category === category
            )
          : response.data.products;

        setData(filtered);
      } catch (err) {
        console.log(err.response?.data?.msg || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  useEffect(() => {
    if (filteredProducts.length > 0) {
      const searched =
        data.length > 0
          ? data.filter((product) =>
              filteredProducts.some((fp) => fp._id === product._id)
            )
          : filteredProducts;

      setProducts(searched);
    } else {
      setProducts([]);
    }
  }, [data, filteredProducts]);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const seeDetails = (product) => {
    // localStorage.setItem("detail", JSON.stringify(product));
    navigate("/more-details", { state: { product } });
  };

  // const addProduct = (product) => {
  //   let cart = JSON.parse(localStorage.getItem("cart")) || [];
  //   // console.log(cart)
  //   if (!Array.isArray(cart)) {
  //     cart = [];
  //   }
  //   const sameItem = cart.find((value) => {
  //     return value.id === product.id;
  //   });
  //   // console.log(cart)

  //   if (sameItem) {
  //     sameItem.quantity += 1;
  //   } else {
  //     cart.push({ ...product, quantity: 1 });
  //   }
  //   localStorage.setItem("cart", JSON.stringify(cart));
  //   alert(product.name + " is added to cart");
  // };

  const addProduct = async (product) => {
    try {
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
      if (response.data.success) {
        toast.success(`${product.name} added to cart`);
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const addProduct1 = (product) => {
  //   localStorage.setItem("cart", JSON.stringify(product));
  // };

  return (
    <div>
      <main className="products-project-main">
        <p className="Products-heading">Products</p>

        <section className="products-section">
          <section className="products-all-product">
            {loading ? (
              <Loader />
            ) : currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div className="products-product" key={product._id}>
                  <div className="products-img-container">
                    <img
                      className="products-product-img"
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
                  <h2 className="products-product-name">{product.name}</h2>
                  <div className="product-price-container">
                    <p className="products-price">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>
                    <s className="product-dashed-price">
                      ₹{(product.price + 20000).toLocaleString("en-IN")}
                    </s>
                  </div>
                  <p className="products-stock">
                    Only {product.stock} left in stock.
                  </p>
                  <button
                    className="products-add-btn"
                    onClick={() => addProduct(product)}
                  >
                    Add to Cart
                  </button>
                  <p
                    className="products-more-details"
                    onClick={() => seeDetails(product)}
                  >
                    See More Details
                  </p>
                </div>
              ))
            ) : (
              <p className="no-results">
                No products found matching your search.
              </p>
            )}
          </section>
          <div className="pagination-container">
            <button
              onClick={() => {
                setCurrentPage(1);
              }}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ⏮️ First
            </button>
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ⬅️ Previous
            </button>
            <span className="pagination-text">
              {" "}
              Page {currentPage} of {totalPages}{" "}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next ➡️
            </button>
            <button
              onClick={() => {
                setCurrentPage(totalPages);
              }}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Last ⏭️
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Product;
