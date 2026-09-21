import { useEffect, useState } from "react";
import api from "../services/api";


function Breeds() {

    const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await api.get("/breeds");

        if (response.data.success) {
          setBreeds(response.data.breeds);
        }
      } catch (error) {
        console.error("Error loading breeds:", error);
        setError("Unable to load dog breeds.");
      } finally {
        setLoading(false);
      }
    };

    fetchBreeds();
  }, []);


  return (

    <div className="inner-page">

      <div className="inner-page-title">

        <h1>
          Dog Breeds 🐶
        </h1>

        <p>
          Learn about different dog breeds
        </p>

      </div>


     <div className="breeds-grid">

  {loading ? (
    <p>Loading breeds... 🐶</p>
  ) : error ? (
    <p>{error}</p>
  ) : breeds.length === 0 ? (
    <p>No breeds available.</p>
  ) : (
    breeds.map((breed) => (

          <div
            className="breed-card"
            key={breed.name}
          >

            <div className="breed-image">
              {breed.emoji}
            </div>

            <div className="breed-content">

              <h3>
                {breed.name}
              </h3>

              <p>
                {breed.description}
              </p>

            </div>

          </div>

        ))
  )}
      </div>


    </div>
  );
}

export default Breeds;