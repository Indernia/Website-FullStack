import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Menupage.css";
import { BASE_URL } from "../../config";


const Menupage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const restaurant = location.state?.restaurant; 

  const [menuItems, setMenuItems] = useState([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);

  useEffect(() => {
    if (!restaurant) {
      setError("No restaurant selected.");
      setLoading(false);
      return;
    }

    console.log(`Fetching menus for ${restaurant.name}`);

    fetch(`${BASE_URL}/menus/restaurant/${restaurant.id}`)
      .then((response) => {
        console.log( response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Menus fetched:", data);
        if (!Array.isArray(data)) {
            console.error("Unexpected API response:", data);
            setMenuItems([]); 
        } else {
            setMenuItems(data);
        }
    })    
      .catch((err) => {
        setError("Failed to fetch menus.");
      })
      .finally(() => setLoading(false));
  }, [restaurant]);

const handleMenuClick = (menu) => {
  navigate(`/menu/sections`, { state: { menu, restaurant } });
};

  const handleAddItem = async () => {
  const accessToken = localStorage.getItem("accessToken");


    const newMenuName = prompt("Enter new menu name:");
    if (!newMenuName) return; 
  
    const newMenu = {
      description: newMenuName,
      restaurantID: restaurant.id, 
    };
  
    try {
      const response = await fetch(`${BASE_URL}/menus/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json","Authorization": `Bearer ${accessToken}`
},
        body: JSON.stringify(newMenu),
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const addedMenu = await response.json();
      console.log("Menu added:", addedMenu);
      fetch(`${BASE_URL}/menus/restaurant/${restaurant.id}`)
      .then(response => response.json())
      .then(updatedMenus => {

      setMenuItems(updatedMenus);})
  
    } catch (error) {
      console.error("Error adding menu:", error);
      alert("Failed to add menu. Please try again.");
    }
  };
  


  const handleRemoveItem = async (id) => {

  const accessToken = localStorage.getItem("accessToken");


    if (!window.confirm("Are you sure you want to remove this menu?")) return;
    try {
      const response = await fetch(`${BASE_URL}/menus/${id}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      console.log(`Menu with ID ${id} deleted successfully. Fetching updated menu list...`);
  
      // Fetch updated list of menus
      fetch(`${BASE_URL}/menus/restaurant/${restaurant.id}`)
        .then(response => response.json())
        .then(updatedMenus => {
          console.log(updatedMenus);
          setMenuItems(updatedMenus); // Updates the state
        })
        .catch(err => {
          console.error("Menus cannot be fetched:", err);
          alert("Menu has not been deleted");
        });
  
    } catch (error) {
      alert("Menu has not been deleted, Please try again.");
    }
  };
  

  return (
    <div className="menu-page">
      <div className="back-arrow" onClick={() => navigate(-1)}>&#8592;</div>
      <div className="menu-wrapper"> 

      <h1>Menu</h1>
      <div className="menu-container">
        <div className="menu-items">
  {Array.isArray(menuItems) ? (
    menuItems.length > 0 ? (
      menuItems.map((menu) => (
<button className="menu-btn" onClick={() => handleMenuClick(menu)}>
  <span className="menu-label">{menu.description}</span>
  <span 
    className="remove-icon"
    onClick={(e) => {
      e.stopPropagation();
      handleRemoveItem(menu.id);
    }}
  >
    🗑️
  </span>
</button>

      ))
    ) : (
      <p>No menus available.</p>
    )
  ) : (
    <p>No menus available</p>
  )}
</div>
        {/* Button to Add New Menu */}
        <div className="button-container">
          <button className="add-btn" onClick={handleAddItem}>+</button>
        </div>
      </div>

      <div className="logo">
        <img src="/favicon.ico" alt="Logo" className="logo-image" />
      </div>
      
</div>
    </div>
  );
};

export default Menupage;
