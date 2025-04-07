"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DefaultNavbar from "@/components/Navbar/DefaultNavbar";

export default function StoreRegister() {
  const router = useRouter();
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("5.6544");  
  const [longitude, setLongitude] = useState("-0.0164");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const res = await fetch("/api/stores/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: storeName,
          email,
          password,
          category: category || "Retail",
          description,
          location,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        localStorage.setItem("storeId", data.storeId); // ✅ Save storeId
        alert("Store registration successful! Redirecting to login...");
        router.push("/storefacing/login");
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  
    setLoading(false);
  };
  

  return (
    <><DefaultNavbar></DefaultNavbar><main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-500">Create A Store Account</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            >
              <option value="">Select Category</option>
  <option value="retail">Retail</option>
  <option value="convenience">Convenience</option>
  <option value="electronics">Electronics</option>
  <option value="fashion">Fashion</option>
  <option value="food-beverages">Food & Beverages</option>
  <option value="health-beauty">Health & Beauty</option>
  <option value="home-furniture">Home & Furniture</option>
  <option value="sports-outdoors">Sports & Outdoors</option>
  <option value="books-stationery">Books & Stationery</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Latitude</label>
            <input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Longitude</label>
            <input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </main></>
  );
}
