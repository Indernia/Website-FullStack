import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Orderpage.css";
import { BASE_URL } from "../config";


const Orderpage = () => {
  const [tableOrders, setTableOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const accessToken = localStorage.getItem("apiKey");
      if (!accessToken) {
        console.error("Missing accessToken");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/orders/byrestaurant`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "Connection": "keep-alive"
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const orders = await response.json();
        console.log("Fetched orders from API:", orders); 

        const grouped = {};
        orders.forEach(order => {
          const tableId = `Table ${order.tableid}`;
          if (!grouped[tableId]) {
            grouped[tableId] = [];
          }
        
          const itemCounts = {};
          order.menuitems.forEach(item => {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
          });
          const itemNames = Object.entries(itemCounts)
          .map(([name, count]) => `${count}x ${name}`)
          .join("\n");
                    grouped[tableId].push({ id: order.id, text: itemNames });
        });
          const formatted = Object.entries(grouped).map(([table, orders]) => ({
            table,
            orders
          }));
          setTableOrders(formatted);
          
      } catch (error) {
        console.error("Error fetching orders:", error);
        setTableOrders([]);
      }
    };

  fetchOrders();

  const intervalId = setInterval(fetchOrders, 10000);

  return () => clearInterval(intervalId);  }, []);

  const handleCheck = async (tableIndex, orderIndex) => {
    const orderText = tableOrders[tableIndex].orders[orderIndex];
    const orderId = tableOrders[tableIndex].orders[orderIndex].id;

    if (!orderId) {
      console.error("Order ID not found in text:", orderText);
      return;
    }

        const accessToken = localStorage.getItem("apiKey");

    try {
      const response = await fetch(`${BASE_URL}/orders/markComplete/${orderId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to mark order ${orderId} as complete. Status: ${response.status}`);
      }

      // Update UI only if API call was successful
      setTableOrders(prevOrders => {
        const updatedOrders = [...prevOrders];
        const updatedTable = { 
          ...updatedOrders[tableIndex], 
          orders: updatedOrders[tableIndex].orders.filter((_, i) => i !== orderIndex) 
        };

        updatedOrders[tableIndex] = updatedTable;
        return updatedOrders.filter(table => table.orders.length > 0);
      });

    } catch (error) {
      console.error("Error marking order as complete:", error);
    }
  };

  return (
    <div className="order-page">
      {/* Back Arrow */}
      <div className="back-arrow" onClick={() => navigate(-1)}>
        &#8592;
      </div>
  
{tableOrders.map((table, tableIndex) => (
  <div key={tableIndex} className="table-section">
    {table.orders.map((order, orderIndex) => (
      <div key={`${tableIndex}-${orderIndex}`} className="order-box">
  <div className="order-header"> {table.table}</div>
  <div className="order-text">
  {order.text.split("\n").map((line, index) => (
    <div key={index}>{line}</div>
  ))}
</div>
  <button
    className="check-btn"
    onClick={() => handleCheck(tableIndex, orderIndex)}
  >
    ✓
  </button>
</div>

    ))}
  </div>
))}

    </div>
  );
};

export default Orderpage;
