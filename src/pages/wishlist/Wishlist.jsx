import React from 'react'
import "./Wishlist.css"

const Wishlist = () => {
  return (
    <div>
       <main className="addtocart-main">
        <div className="addtocart-container">
          <p className="addtocart-head">Cart</p>
          <div className="addtocart-totalprice">
            <p>
              Total Price :{" "}
              {/* <span className="addtocart-value">₹{totalPrice()}</span> */}
            </p>
          </div>
          <button className="addtocart-btn">Buy Now</button>
          <section className="addtocart-section">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div className="addtocart-product" key={index}>
                  <img id="addtocart-img" src={img} alt="Product Image" />
                  <h2 id="addtocart-name">{product.name}</h2>
                  {/* <div id="addtocart-description">
                    {product.description.map((value, i) => (
                      <p key={i}>{value}</p>
                    ))}
                  </div> */}
                  <p className="addtocart-price">
                    Price: ₹<span id="addtocart-price">{product.price}</span>
                  </p>
                  {/* <div className="addtocart-quantity">
                    {product.quantity === 1 ? (
                      <button
                        className="addtocart-decrease"
                        onClick={() => removeFromCart(product.id)}
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
                        onClick={() => decrease(product.id)}
                      >
                        -
                      </button>
                    )}

                    <span className="addtocart-quantityNum">
                      {product.quantity}
                    </span>
                    <button
                      className="addtocart-increase"
                      onClick={() => increase(product.id)}
                    >
                      +
                    </button>
                  </div> */}
                  <button
                    className="addtocart-remove-btn"
                    onClick={() => removeFromCart(product.id)}
                  >
                    Remove From Cart
                  </button>
                  <Link to="/">
                    <button className="addtocart-btn">Back to Products</button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="addtocart-emt">
                <p className="addtocart-empty">Your cart is empty.</p>
                <Link to="/">
                  <button className="addtocart-shop-btn">Shop Now</button>
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default Wishlist
