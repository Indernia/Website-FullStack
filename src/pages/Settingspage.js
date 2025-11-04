import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settingspage.css";
import RestaurantEditor from "../components/RestaurantEditor";
import { BASE_URL } from "../config";



const SettingsPage = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/restaurants`)
      .then(response => response.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error("Error fetching restaurants:", err));
  }, []);

  const handleRestaurantClick = (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
  };

  const handleGenerateApiKey = async () => {
    if (!selectedRestaurantId) {
      alert("Please select a restaurant first!");
      return;
    }

    setLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Access token missing. Please log in again.");
        navigate("/login");
        return;
      }

      const response = await fetch(`${BASE_URL}/apiKeys/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({ restaurantID: selectedRestaurantId })
      });

      if (!response.ok) {
        throw new Error(`Failed to create API key. Status: ${response.status}`);
      }

      const data = await response.json();
      alert(`API Key: ${data.message}`);

    } catch (error) {
      console.error("Error generating API key:", error);
      alert("Failed to generate API key. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
<div className="menu-page">
  <div className="back-arrow" onClick={() => navigate(-1)}>
    &#8592;
  </div>

  <div className={`settings-split-screen ${selectedRestaurantId ? "expanded" : ""}`}>
    <div className="settings-left">
      <h2>Generate API Key</h2>
      <p>Choose the restaurant you want to generate an API Key for:</p>

      <div className="menu-items">
        {restaurants.map((restaurant) => (
          <button
            key={restaurant.id}
            className={`settings-restaurant-btn ${selectedRestaurantId === restaurant.id ? "selected" : ""}`}
            onClick={() => handleRestaurantClick(restaurant.id)}
          >
            {restaurant.name}
          </button>
        ))}
      </div>

      <div className="button-container">
        <button className="generate-key-btn" onClick={handleGenerateApiKey} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>

    <div className="settings-right">
      {selectedRestaurantId && (
        <RestaurantEditor
          restaurant={restaurants.find(r => r.id === selectedRestaurantId)}
          onSave={async (updatedData) => {
            const accessToken = localStorage.getItem("accessToken");
            console.log("Sending data:", updatedData);
            const response = await fetch(`${BASE_URL}/${selectedRestaurantId}/update`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
              },
              body: JSON.stringify(updatedData),
            });

            if (response.ok) {
              alert("Restaurant updated successfully.");
            } else {
              alert("Failed to update restaurant.");
            }
          }}
        />
      )}
    </div>
  </div>

  <div className="logo">
    <img src="/favicon.ico" alt="Logo" className="logo-image" />
  </div>
</div>
  );
};

export default SettingsPage;
