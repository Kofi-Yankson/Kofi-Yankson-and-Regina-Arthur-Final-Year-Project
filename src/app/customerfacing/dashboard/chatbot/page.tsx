"use client";
import CustomerNavbar from "@/components/Navbar/CustomerNavbar";
import { useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  priceInPeswass: number;
  imagePath: string;
  store: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

export default function ChatbotPage() {
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message, language: "en" }),
      });

      if (!res.ok) {
        throw new Error(`API error! Status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response || "No response from chatbot.");
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setResponse("An error occurred while fetching the chatbot response.");
    }
  };

  return (
    <>
      <CustomerNavbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Chatbot</h1>

        <textarea
          className="w-full p-2 border rounded-md mt-4"
          placeholder="Ask me something like 'Where can I find a laptop?'"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>

        {response && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p><strong>Chatbot:</strong> {response}</p>
          </div>
        )}

        {products.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Matching Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border p-4 rounded-lg shadow-md">
                  <img
                    src={product.imagePath}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded"
                  />
                  <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                  <p className="text-gray-600">GH₵ {(product.priceInPeswass / 100).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Store: {product.store.name}</p>
                  <Link
                    href={`/customerfacing/dashboard/products/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
