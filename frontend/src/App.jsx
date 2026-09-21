import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Breeds from "./pages/Breeds";
import Services from "./pages/Services";
import JoinUs from "./pages/JoinUs";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import Dogs from "./pages/Dogs";
import DogDetails from "./pages/DogDetails";
import MyDogRequests from "./pages/MyDogRequests";
import MyDonations from "./pages/MyDonations";
import MyServiceRequests from "./pages/MyServiceRequests";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import AdminDogRequests from "./pages/AdminDogRequests";
import AdminDogs from "./pages/AdminDogs";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminOrders from "./pages/AdminOrders";
import ServiceRequest from "./pages/ServiceRequest";
import AdminServiceRequests from "./pages/AdminServiceRequests";
import AdminBreeds from "./pages/AdminBreeds";
import "./App.css";

function App() {
  return (
    <div className="app">

      <Navbar />

      <main>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/breeds" element={<Breeds />} />
          <Route path="/services" element={<Services />} />
          <Route path="/join-us" element={<JoinUs />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/service-request" element={<ServiceRequest />} />
          <Route path="/dogs" element={<Dogs />} />
          <Route path="/dogs/:id" element={<DogDetails />} />
          <Route path="/my-dog-requests" element={<MyDogRequests />} />
          <Route path="/my-service-requests" element={<MyServiceRequests />} />
          <Route path="/my-donations" element={<MyDonations />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dogs" element={<AdminDogs />} />
            <Route path="/admin/dog-requests" element={<AdminDogRequests />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/service-requests" element={<AdminServiceRequests />} />
            <Route path="/admin/breeds" element={<AdminBreeds />} />
          </Route>
            
        <Route
            path="*"
            element={
              <div className="not-found">
                <h1>404</h1>
                <p>Page not found.</p>
              </div>
            }
          />

        </Routes>
      </main>

    </div>
  );
}

export default App;