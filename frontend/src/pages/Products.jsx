import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Products() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    getProducts();

  }, []);


  const getProducts = async () => {

    try {

      const response = await api.get("/products");

      console.log(
        "PRODUCT API RESPONSE:",
        response.data
      );

      const data = response.data;

      if (Array.isArray(data)) {

        setProducts(data);

      } else if (Array.isArray(data.products)) {

        setProducts(data.products);

      } else {

        setProducts([]);

      }

    } catch (error) {

      console.error(
        "PRODUCT API ERROR:",
        error
      );

      setError(
        "Unable to load products."
      );

    } finally {

      setLoading(false);

    }
  };


  if (loading) {

    return (
      <div className="products-page">
        <div className="products-header">
          <h1>Our Products</h1>
          <p>Loading products...</p>
        </div>
      </div>
    );

  }


  if (error) {

    return (
      <div className="products-page">
        <div className="products-header">
          <h1>Our Products</h1>
          <p>{error}</p>
        </div>
      </div>
    );

  }


  return (

    <div className="products-page">

      <div className="products-header">

        <h1>
          Our Products
        </h1>

        <p>
          Find everything your pet needs 🐾
        </p>

      </div>


      <div className="products-grid">

        {products.length === 0 ? (

          <div className="empty-state">

            <div className="empty-state-icon">
              🐾
            </div>

            <h2>
              No products available
            </h2>

            <p>
              Products will appear here once
              they are added.
            </p>

          </div>

        ) : (

          products.map(product => (

            <ProductCard
              key={product._id}
              product={product}
            />

          ))

        )}

      </div>

    </div>
  );
}

export default Products;