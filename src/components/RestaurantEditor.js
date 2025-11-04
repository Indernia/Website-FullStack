import React, { useState, useEffect } from "react";

const RestaurantEditor = ({ restaurant, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    openingTime: "",
    closingTime: "",
    latitude: "",
    longitude: "",
    totaltables: "",
    stripeKey: "",

  });

  useEffect(() => {
    if (!restaurant) return;

    console.log("Loaded restaurant:", restaurant);

    setForm({
      name: restaurant.name || "",
      description: restaurant.description || "",
      openingTime: restaurant.openingtime || "",
      closingTime: restaurant.closingtime || "",
      latitude: restaurant.latitude !== null && restaurant.latitude !== undefined ? restaurant.latitude : "",
      longitude: restaurant.longitude !== null && restaurant.longitude !== undefined ? restaurant.longitude : "",
      totaltables: restaurant.totaltables ?? "",
      stripeKey: "",
    });

    setIsEditing(false);
  }, [restaurant]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const completeData = {
      ...form,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      totaltables: parseInt(form.totaltables, 10),
      stripeKey: form.stripeKey
    };

    onSave(completeData);
    setIsEditing(false);
  };

  console.log("isEditing:", isEditing);
  return (
    <div className="editor-section">
      <h3>Edit Restaurant</h3>
            <form
        className="restaurant-editor-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (isEditing) {
            handleSave();
          }
        }}
      >

        <label htmlFor="name">Name:</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          readOnly={!isEditing}
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          readOnly={!isEditing}
        />

        <label htmlFor="openingTime">Opening Time:</label>
        <input
          id="openingTime"
          name="openingTime"
          value={form.openingTime}
          onChange={handleChange}
          readOnly={!isEditing}
        />

        <label htmlFor="closingTime">Closing Time:</label>
        <input
          id="closingTime"
          name="closingTime"
          value={form.closingTime}
          onChange={handleChange}
          readOnly={!isEditing}
        />


        <label htmlFor="latitude">Latitude:</label>
        <input
          id="latitude"
          name="latitude"
          type="number"
          step="any"
          value={form.latitude}
          onChange={handleChange}
          readOnly={!isEditing}
        />

        <label htmlFor="longitude">Longitude:</label>
        <input
          id="longitude"
          name="longitude"
          type="number"
          step="any"
          value={form.longitude}
          onChange={handleChange}
          readOnly={!isEditing}
        />

        <label htmlFor="totaltables">Total Tables:</label>
        <input
        id="totaltables"
        name="totaltables"
        type="number"
        value={form.totaltables}
        onChange={handleChange}
        readOnly={!isEditing}
        />

        <label htmlFor="stripeKey">Stripe Key:</label>
        <input
          id="stripeKey"
          name="stripeKey"
          type="text"
          value={form.stripeKey}
          onChange={handleChange}
          readOnly={!isEditing}
        />



{isEditing ? (
  <>
    <button type="submit">Save</button>
    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
  </>
) : (
  <button type="button" onClick={() => setIsEditing(true)}>
    Edit
  </button>
)}

      </form>
    </div>
  );
};

export default RestaurantEditor;
