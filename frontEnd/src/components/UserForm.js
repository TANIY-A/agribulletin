import React, { useState } from 'react';

const UserForm = ({ addUser, updateUser, userData }) => {
  const [user, setUser] = useState(userData);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (user.id) {
      updateUser(user);
    } else {
      addUser({ ...user, id: Date.now() });
    }
    setUser(userData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Username</label>
      <input type="text" name="username" value={user.username} onChange={handleInputChange} />

      <label>Phone No</label>
      <input type="text" name="phone" value={user.phone} onChange={handleInputChange} />

      <label>Address</label>
      <input type="text" name="address" value={user.address} onChange={handleInputChange} />

      <label>Category</label>
      <select name="category" value={user.category} onChange={handleInputChange}>
        <option value="ST">ST</option>
        <option value="SC">SC</option>
        <option value="Others">Others</option>
      </select>

      <button type="submit">{user.id ? 'Update' : 'Add'}</button>
    </form>
  );
};

export default UserForm;
