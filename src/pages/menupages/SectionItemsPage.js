    import React, { useEffect, useState, useRef } from "react";
    import { useLocation, useNavigate } from "react-router-dom";
    import AddItemsModal from "../../components/AddItemsModal";
    import "./SectionItemsPage.css";
    import { BASE_URL } from "../../config";


    const SectionItemsPage = () => {
      const navigate = useNavigate();
      const location = useLocation();
      const { section } = location.state || {};
      const [items, setItems] = useState([]);
      const [modalOpen, setModalOpen] = useState(false);
      const [editingItem, setEditingItem] = useState(null);
      const [uploadingItem, setUploadingItem] = useState(null);
      const fileInputRef = useRef(null);
      const [allTags, setAllTags] = useState([]);

      const fetchItems = React.useCallback( async () => {
        if (!section) return;

        try {
          const res = await fetch(`${BASE_URL}/api/menuItems/section/${section.id}`);
          const data = await res.json();
          setItems(data);
        } catch (err) {
          console.error(err);
          alert("Failed to load items.");
        }
      }, [section]);

      useEffect(() => {
        fetchItems();
      }, [fetchItems]);

      useEffect(() => {
      const fetchTags = async () => {
      try {
      const res = await fetch(`${BASE_URL}/api/tags/`);
      if (!res.ok) throw new Error("Kan’t fetch tags");
      const data = await res.json();
      console.log("🔖 Tags fetched:", data);
      setAllTags(data);
      } catch (err) {
      console.error("Fejl ved hentning af tags:", err);
      }
      };
      fetchTags();
      }, []);

 const addTagToItem = async (menuItemID, tagID) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BASE_URL}/api/tags/addTagToItem/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ menuItemID, tagID })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.status);
      }
      await fetchItems();
    } catch (err) {
      console.error("Kunne ikke tilføje tag:", err);
      alert("Fejl ved tilføjelse af tag");
    }
  };

  const removeTagFromItem = async (menuItemID, tagID) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BASE_URL}/api/tags/removeTagFromItem/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ menuItemID, tagID })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.status);
      }
      // opdater UI bagefter
      await fetchItems();
    } catch (err) {
      console.error("Kunne ikke fjerne tag:", err);
      alert("Fejl ved fjernelse af tag");
    }
  };

      const handleAdd = () => {
        setEditingItem(null);
        setModalOpen(true);
      };

      const handleEdit = (item) => {
        setEditingItem(item);
        setModalOpen(true);
      };

      const handleDelete = async (id) => {
        if (!window.confirm("Delete this item?")) return;
        try {
          const token = localStorage.getItem("accessToken");
          const res = await fetch(`${BASE_URL}/api/menuItems/${id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`
            },
          });

          if (!res.ok) throw new Error(`Failed to delete item: ${res.status}`);
          setItems(items.filter((item) => item.id !== id));
        } catch (err) {
          console.error(err);
          alert("Failed to delete item.");
        }
      };

      const saveItem = async (item) => {
        const parsedPrice = parseFloat(item.price);
        if (isNaN(parsedPrice)) {
          alert("Please enter a valid price.");
          return;
        }

        const token = localStorage.getItem("accessToken");

        const payload = {
          name: item.name,
          description: item.description,
          price: parsedPrice,
          type: item.type, // required for API
          sectionID: section.id,
          tags: item.tags || [],
        };

        const isEdit = !!item.id;
        const url = isEdit
          ? `${BASE_URL}/api/menuItems/${item.id}/update`
          : `${BASE_URL}/api/menuItems/add`;

        try {
          const res = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Save failed: ${res.status} - ${errorText}`);
          }

          await fetchItems(); // refresh list
          setModalOpen(false);
        } catch (err) {
          console.error(err);
          alert("Failed to save item.");
        }
      };

      const handleUploadImage = async (event) => {
        const file = event.target.files[0];
        if (!file || !uploadingItem) return;

        try {
          const accessToken = localStorage.getItem("accessToken");
          const res = await fetch(`${BASE_URL}/api/SASURL`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              fileName: uploadingItem.name + uploadingItem.id,
              itemID: uploadingItem.id
            }),
          });

          const { sasUrl } = await res.json();

          const uploadRes = await fetch(sasUrl, {
            method: "PUT",
            headers: {
              "x-ms-blob-type": "BlockBlob",
              "Content-Type": file.type,
            },
            body: file,
          });

          if (uploadRes.ok) {
            alert("✅ Image uploaded successfully!");
            await fetchItems();
          } else {
            alert("❌ Image upload failed.");
          }
        } catch (err) {
          console.error("Image upload error:", err);
          alert("❌ Upload error occurred.");
        } finally {
          setUploadingItem(null);
          event.target.value = "";
        }
      };

      const handleImageUploadClick = (item) => {
        setUploadingItem(item);
        fileInputRef.current.click();
      };

      return (
        <div className="section-items-page">
          <div className="back-arrow" onClick={() => navigate(-1)}>&#8592;</div>
          <div className="menu-container">
            <h1>{section?.name || "Items"}</h1>
        <div className="menu-items">
          {items.length > 0 ? (
            items.map(item => (
              <div key={item.id} className="menu-item-container">
                <div className="menu-item-content">
                  <div className="menu-item-details">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p>
                      <strong>Price:</strong> {item.price?.toFixed(2)} DKK
                    </p>

                    <div className="item-tags">
                      {item.tags
                        ?.filter(t => t)
                        .map(t => (
                          <span key={t.id} className="tag-badge">
                            {t.tagvalue}
                            <button onClick={() => removeTagFromItem(item.id, t.id)}>
                              ×
                            </button>
                          </span>
                        ))}

                      <details className="tag-dropdown">
                        <summary>➕ Tags</summary>
                        <div className="tag-options">
                          {allTags.map(tag => {
const safeTags = (item.tags || []).filter(t => t);
const isChecked = safeTags.some(t => t.id === tag.id);
                            return (
                              <label key={tag.id} className="tag-option">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() =>
                                    isChecked
                                      ? removeTagFromItem(item.id, tag.id)
                                      : addTagToItem(item.id, tag.id)
                                  }
                                />
                                {tag.tagvalue}
                              </label>
                            );
                          })}
                        </div>
                      </details>
                    </div>
                  </div>

                  <div className="menu-actions">
                    <button className="edit-btn" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button className="remove-btn" onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                    <button className="upload-btn" onClick={() => handleImageUploadClick(item)}>
                      Upload Image
                    </button>
                  </div>

                  <div className="menu-item-image">
                    <img
                      src={item.photolink}
                      alt={item.name}
                      onError={e => (e.target.style.display = "none")}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No items in this section.</p>
          )}
        </div>

        <div className="button-container">
          <button className="add-btn" onClick={handleAdd}>
            ➕ Add Item
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleUploadImage}
        />

        <AddItemsModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={saveItem}
          existingItem={editingItem}
        />

        </div>
        </div>

      );
    };

    export default SectionItemsPage;