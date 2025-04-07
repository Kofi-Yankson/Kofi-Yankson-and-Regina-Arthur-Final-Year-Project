"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DefaultNavbar from "@/components/Navbar/DefaultNavbar";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";

// Custom Marker Icon
const customMarker = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function CustomerRegister() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(5.7744); // Default: Academic City
  const [longitude, setLongitude] = useState(-0.2133);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/customer/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, location, latitude, longitude }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful! Redirecting to login...");
        router.push("/customerfacing/login");
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <DefaultNavbar />
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">Create Customer Account</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mt-1"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mt-1"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mt-1"
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mt-1"
                placeholder="e.g. Accra, Tema, Kumasi"
                required
              />
            </div>

            {/* Map Picker */}
            <div className="h-64 w-full rounded-md overflow-hidden my-4 border">
              <MapContainer center={[latitude, longitude]} zoom={13} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapDraggableMarker
                  latitude={latitude}
                  longitude={longitude}
                  setLatitude={setLatitude}
                  setLongitude={setLongitude}
                />
              </MapContainer>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4 text-sm">
            Already have an account?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => router.push("/customerfacing/login")}
            >
              Login
            </span>
          </p>
        </div>
      </main>
    </>
  );
}

// Draggable Marker
function MapDraggableMarker({ latitude, longitude, setLatitude, setLongitude }: any) {
  const map = useMap();

  useState(() => {
    map.setView([latitude, longitude], 13);
  });

  const marker = L.marker([latitude, longitude], {
    draggable: true,
    icon: customMarker,
  }).addTo(map);

  marker.on("dragend", (e) => {
    const { lat, lng } = e.target.getLatLng();
    setLatitude(lat);
    setLongitude(lng);
  });

  return null;
}
