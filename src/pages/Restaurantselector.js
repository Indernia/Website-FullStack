import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddRestaurantModal from "../components/AddRestaurantModal";
import "./Restaurantselector.css";
import "./Homepage.css";
import { BASE_URL } from "../config";


const RestaurantSelector = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
  const [loadingRestaurantId, setLoadingRestaurantId] = useState(null);



  useEffect(() => {
    fetch(`${BASE_URL}/restaurants`)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched restaurants:", data);
        setRestaurants(data); 
      })
      .catch(err => console.error("Error fetching restaurants:", err));
  }, []);

const handleMenuClick = async (restaurant) => {
  setLoadingRestaurantId(restaurant.id);

    navigate("/menu", { state: { restaurant } });

    };    
    const handleAddRestaurant = () => {
      setRestaurantModalOpen(true); 
    };
    

    const saveRestaurant = async ({ name: restaurantName, openingTime, closingTime, description, stripeKey, totaltables }) => {
    const accessToken = localStorage.getItem("accessToken");
    
      const newRestaurant = {
        name: restaurantName?.trim(),
        latitude: 52.6761,
        longitude: 11.5683,
        openingTime: openingTime?.trim(),
        closingTime: closingTime?.trim(),
        description,
        stripeKey,
        totaltables: parseInt(totaltables, 10), 
      };
    
      try {
        const response = await fetch(`${BASE_URL}/restaurant/add`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}` 
          },
          body: JSON.stringify(newRestaurant),
        });
    
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
        const addedRestaurant = await response.json();
        console.log("Restaurant added:", addedRestaurant);
    
        const updated = await fetch(`${BASE_URL}/restaurants`);
        const updatedRestaurants = await updated.json();
        setRestaurants(updatedRestaurants);
        setRestaurantModalOpen(false);
      } catch (error) {
        console.error("Error adding restaurant:", error);
        alert("Failed to add restaurant. Please try again.");
      }
    };
    

            const handleRemoveItem = async (restaurantID) => {

            const accessToken = localStorage.getItem("accessToken");

              if (!window.confirm("Are you sure you want to remove this restaurant?")) return;
              try {
                const response = await fetch(`${BASE_URL}/restaurants/${restaurantID}`, {
                  method: "DELETE",
                  mode: "cors",
                  headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${accessToken}`

                  },
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                console.log(`Restaurant with ID ${restaurantID} deleted successfully. Fetching updated restaurant list...`);

                fetch(`${BASE_URL}/restaurants`)
                  .then(response => response.json())
                  .then(updatedRestaurants => {
                    console.log(updatedRestaurants);
                    setRestaurants(updatedRestaurants); // Updates the state
                  })
                  .catch(err => {
                    console.error("Restaurants cannot be fetched:", err);
                    alert("Restaurant has not been deleted");
                  });

              } catch (error) {
                alert("Restaurant has not been deleted, Please try again.");
              }
            };

            const handleLogout = () => {
              const confirmLogout = window.confirm("Are you sure you want to log out?");
              if (confirmLogout) {
              localStorage.removeItem("accessToken");
              navigate("/");
              }
            };
  

    return (
      <div className="menu-page">
        <div className="settings-button" onClick={() => navigate("/settings")}>
          ⚙️
        </div>
        <div className="logout-button-wrapper">
        <div className="logout-btn">
             <button onClick={handleLogout} className="logout-button">Log out</button>
        </div>
        </div>
        <div className="menu-wrapper"> 
        <h1>Restaurants</h1>
          <div className="menu-container">
    
            <div className="menu-items">
              {restaurants.length > 0 ? (
                restaurants.map((item) => (
                  <button
                    key={item.id}
                    className="menu-btn"
                    onClick={() => handleMenuClick(item)}
                    disabled={loadingRestaurantId === item.id}
                  >
                    {loadingRestaurantId === item.id ? (
                      <>
                        <span className="spinner"></span> Loading...
                      </>
                    ) : (
                      <>
                        {item.name}
                      </>
                    )}
                    <span
                      className="remove-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item.id);
                      }}
                    >
                      🗑️
                    </span>
                  </button>

                ))
              ) : (
                <p></p>
              )}
            </div>
            <div className="button-container">
            <button className="add-btn" onClick={handleAddRestaurant}>+</button>
          </div>
          </div>
        </div>
    
        <div className="logo">
          <img src="/favicon.ico" alt="Logo" className="logo-image" />
        </div>
        <AddRestaurantModal
  isOpen={restaurantModalOpen}
  onClose={() => setRestaurantModalOpen(false)}
  onSave={saveRestaurant}
/>

      </div>
    );
  };
    
export default RestaurantSelector;
