import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MenuSectionPage.css";
import { BASE_URL } from "../../config";


const MenuSectionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { menu, restaurant } = location.state || {};
  const [sections, setSections] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!menu) {
      console.error("No menu passed to MenuSectionPage.");
      setError("No menu selected.");
      return;
    }

    console.log("Menu object:", menu);
    console.log("Fetching sections for menu ID:", menu.id);

    fetch(`${BASE_URL}/menuSections/menu/${menu.id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch. Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Sections fetched:", data);
        setSections(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Could not load menu sections.");
      });
  }, [menu]);

  const handleClick = (section) => {
    navigate("/menu/sectionItems", { state: { section, menu, restaurant } });
  };

  const handleAddSection = async () => {
    const name = prompt("Enter new section name:");
    if (!name) return;
    const accessToken = localStorage.getItem("accessToken");

    const newSection = {
      name,
      menuID: menu.id,
    };

    try {
      const response = await fetch(`${BASE_URL}/menuSections/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(newSection),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const added = await response.json();
      setSections((prev) => [...prev, added]); // Update state directly

      // Fetch updated sections
      await fetch(`${BASE_URL}/menuSections/menu/${menu.id}`)
        .then((res) => res.json())
        .then((updatedSections) => setSections(updatedSections))
        .catch((err) => console.error("Error fetching updated sections:", err));

    } catch (err) {
      console.error("Failed to add section:", err);
      alert("Could not add new section. Try again.");
    }
  };


const handleRemoveItem = async (sectionID) => {

            const accessToken = localStorage.getItem("accessToken");

              if (!window.confirm("Are you sure you want to remove this section?")) return;
              try {
                const response = await fetch(`${BASE_URL}/menuSections/${sectionID}`, {
                  method: "DELETE",
                  mode: "cors",
                  headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${accessToken}`

                  },
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                console.log(`Section with ID ${sectionID} deleted successfully. Fetching updated restaurant list...`);

                fetch(`${BASE_URL}/menuSections/menu/${menu.id}`)
                  .then(response => response.json())
                  .then(updatedSections => {
                    console.log(updatedSections);
                    setSections(updatedSections);
                  })
              } catch (error) {
                alert("Section has not been deleted, Please try again.");
              }
            };

  return (
    <div className="menu-page">
      <div className="back-arrow" onClick={() => navigate(-1)}>&#8592;</div>
      <div className="menu-wrapper">
      <h2>{menu?.description} - {restaurant?.name} Sections</h2>

      <div className="menu-container">

        {error ? (
          <p>{error}</p>
        ) : (
          <div className="menu-items">
            {sections.map((section) => (
              <div
                key={section.id}
                className="menu-item-container"
                onClick={() => handleClick(section)}
              >
                <button className="menu-btn">{section.name}

                        <span
                          className="remove-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(section.id);
                          }}
                        >
                        🗑️
                    </span>
                </button>
              </div>

            ))}
          </div>

        )}

        <div className="button-container">
          <button className="add-btn" onClick={handleAddSection}>+</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default MenuSectionsPage;
