import { Link } from "react-router-dom";

function Home() {

  return (
    <div className="home">

      <section className="hero">

        <div className="hero-content">

          <div className="hero-small-title">
            🐾 Everything your pet needs
          </div>

          <h1>
            Happy Pets,
            <br />
            Happy <span>Homes</span>
          </h1>

          <p className="hero-description">
            Discover quality food, toys,
            accessories and everything your
            furry friends need to live a happy
            and healthy life.
          </p>

          <Link
            to="/products"
            className="primary-button"
          >
            Shop Now →
          </Link>

        </div>


        <div className="hero-image">
          🐶
        </div>

      </section>


      <section className="categories-section">

        <div className="section-title">

          <h2>
            Shop by Category
          </h2>

          <p>
            Everything your pet needs,
            all in one place
          </p>

        </div>


        <div className="category-grid">

          <div className="category-card">
            <div className="category-icon">
              🍖
            </div>

            <h3>
              Pet Food
            </h3>

            <p>
              Healthy food for your pets
            </p>
          </div>


          <div className="category-card">
            <div className="category-icon">
              🧸
            </div>

            <h3>
              Toys
            </h3>

            <p>
              Fun toys for happy pets
            </p>
          </div>


          <div className="category-card">
            <div className="category-icon">
              🛏️
            </div>

            <h3>
              Accessories
            </h3>

            <p>
              Comfort and style for pets
            </p>
          </div>


          <div className="category-card">
            <div className="category-icon">
              💊
            </div>

            <h3>
              Pet Care
            </h3>

            <p>
              Care products for your pets
            </p>
          </div>

        </div>

      </section>


      <section className="features-section">

        <div className="feature">

          <div className="feature-icon">
            🚚
          </div>

          <h3>
            Fast Delivery
          </h3>

          <p>
            Quick and reliable delivery
          </p>

        </div>


        <div className="feature">

          <div className="feature-icon">
            ⭐
          </div>

          <h3>
            Quality Products
          </h3>

          <p>
            Products you can trust
          </p>

        </div>


        <div className="feature">

          <div className="feature-icon">
            ❤️
          </div>

          <h3>
            Made with Love
          </h3>

          <p>
            Because pets deserve the best
          </p>

        </div>

      </section>

            <section className="donation-home-section">

        <div className="donation-home-content">

          <div className="donation-home-icon">
            🐕❤️
          </div>

          <div>
            <p className="donation-home-label">
              GIVE A LITTLE • HELP A LOT
            </p>

            <h2>
              Help a Stray Dog Today
            </h2>

            <p>
              Your contribution can help provide
              food, treatment and shelter for dogs
              in need.
            </p>
          </div>

          <Link
            to="/donate"
            className="donation-home-button"
          >
            Donate Now ❤️
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;