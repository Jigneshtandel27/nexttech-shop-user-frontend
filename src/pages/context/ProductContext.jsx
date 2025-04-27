import { createContext, useState } from "react";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);

  return (
    <ProductContext.Provider value={{ filteredProducts, setFilteredProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
