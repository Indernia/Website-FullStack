import React, { useState, useEffect } from "react";
import "./AddItemsModal.css";

const AddItemModal = ({ isOpen, onClose, onSave, existingItem }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (existingItem) {
      setName(existingItem.name || "");
      setDescription(existingItem.description || "");
      setPrice(existingItem.price || "");
    } else {
      setName("");
      setDescription("");
      setPrice("");
    }
  }, [isOpen, existingItem]);

  const handleSave = () => {
    if (!name || !description || !price) {
      alert("All fields are required!");
      return;
    }

    onSave({
      id: existingItem?.id,
      name,
      description,
      price: parseFloat(price),
      type: "food",  // stadig hardcoded
      // tags: … fjernet
    });

    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>{existingItem ? "Edit Item" : "Add New Item"}</h2>

        <label>Title</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter item name"
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Enter item description"
        />

        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Enter price"
        />

        {/* TAG-FELTET ER FJERNET HER */}

        <div className="modal-buttons">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
