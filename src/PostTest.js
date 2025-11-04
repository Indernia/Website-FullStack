import { useState } from "react";

function PostTest() {
  const [user, setUser] = useState({ name: "Jørgen skovbo", email: "skovbo@gail.com" });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await fetch("http://130.225.170.52:10331/users/adduser", {
        method: "POST",
        headers:{
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setMessage("✅ User added successfully!");
      setUser({ name: "", email: "" }); // Reset form
    } catch (error) {
      console.error("❌ Error posting user:", error);
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default PostTest;
