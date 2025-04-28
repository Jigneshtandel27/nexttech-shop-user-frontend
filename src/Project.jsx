import "./Project.css";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import cartLogo from "./assets/icons/cart.png";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import user from "./assets/icons/profile.png";
import { ProductContext } from "./pages/context/ProductContext";

const Project = () => {
  const location = useLocation();
  const { setFilteredProducts } = useContext(ProductContext);
  const [name, setName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [userData, setUserData] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const profileRef = useRef();
  const hamburgerRef = useRef();
  const navRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${process.env.BACKEND_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllProducts(response.data.products);
      setFilteredProducts(response.data.products);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.BACKEND_URL}/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(response.data.user);
      // console.log(response.data.user);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowInfo(false);
      }
      if (
        navRef.current &&
        !navRef.current.contains(e.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const Change = (event) => {
    let value = event.target.value.trim();
    setName(value);

    if (value === "") {
      setSuggestions([]);
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.category.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setFilteredProducts(filtered);
    }
  };
  const handleClick = (item) => {
    const selectedValue = item.name || item.category;
    setName(selectedValue);
    setSuggestions([]);

    const filtered = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(selectedValue.toLowerCase()) ||
        product.category.toLowerCase().includes(selectedValue.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

  // useEffect(() => {
  //   if (name === "") {
  //     setData(products);
  //     localStorage.setItem("allData", JSON.stringify(products));
  //   } else {
  //     const filterData = products.filter((product) =>
  //       product.category.toLowerCase().includes(name.toLowerCase())
  //     );
  //     setData(filterData);
  //     localStorage.setItem("allData", JSON.stringify(filterData));
  //   }
  // }, [name]);

  return (
    <>
      <div className="bg-img">
        <title>Document</title>
        <header>
          <nav className="navbar">
            <h1 className="logo">JIGNESH</h1>

            {/* Hamburger Menu */}
            <div ref={hamburgerRef} className="hamburger" onClick={toggleMenu}>
              ☰
            </div>
            <div ref={navRef} className={`nav-right ${menuOpen ? "open" : ""}`}>
              <ul className={`list ${menuOpen ? "open" : ""}`}>
                <li>
                  <Link className="a-link" to="/" onClick={closeMenu}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="a-link" to="/products" onClick={closeMenu}>
                    Products
                  </Link>
                </li>
                <li>
                  <Link className="a-link" to="/services" onClick={closeMenu}>
                    Services
                  </Link>
                </li>
                <li>
                  <Link className="a-link" to="/contact" onClick={closeMenu}>
                    Contact
                  </Link>
                </li>
              </ul>

              <div className="nav-end">
                <Link to="/addtocart">
                  <img
                    id="logo"
                    src={cartLogo}
                    alt="Cart Logo"
                    onClick={closeMenu}
                  />
                </Link>

                <div className="search-container">
                  <input
                    type="search"
                    name="search"
                    className={`search ${
                      location.pathname.startsWith("/products") ? "hidden" : ""
                    }`}
                    placeholder="Search"
                    onChange={Change}
                    value={name}
                  />
                  {suggestions.length > 0 && (
                    <ul className={`dropdown-list ${name ? "" : "hidden"}`}>
                      {suggestions.map((item, index) => (
                        <li key={index} onClick={() => handleClick(item)}>
                          {item.name} <small>{item.category}</small>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Logout & Auth Buttons */}
                {token ? (
                  <div
                    ref={profileRef}
                    className="project-profile"
                    onClick={() => setShowInfo(!showInfo)}
                  >
                    <div className="project-user-info">
                      <img src={user} alt="User" className="project-img" />
                      <span className="project-user-name">{userData.name}</span>
                      {userData && showInfo && (
                        <div className="project-user-container">
                          <div className="project-user-data">
                            <p>Name : {userData.name}</p>
                            <p>Email : {userData.email}</p>
                            <p>Mobile No. : {userData.mobile}</p>
                            <button
                              className="project-user-logout"
                              onClick={logout}
                            >
                              Log Out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="btns">
                    <button className="sign-up">
                      <Link className="btn" to="/registration">
                        Sign Up
                      </Link>
                    </button>
                    <button className="login">
                      <Link className="btn" to="/login">
                        Login
                      </Link>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>

        <Outlet />

        <footer>
          <p className="project-text">© 2025 JIGNESH. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Shipping & Returns</a>
            <a href="#">FAQ</a>
          </div>
          <div className="social-links">
            <a href="#">Facebook</a> | <a href="#">Instagram</a> |{" "}
            <a href="#">Twitter</a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Project;
