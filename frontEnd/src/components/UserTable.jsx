import React from 'react';

const UserTable = ({ users, deleteUser, editUser }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Phone No</th>
          <th>Address</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.phone}</td>
            <td>{user.address}</td>
            <td>{user.category}</td>
            <td>
              <button onClick={() => editUser(user)}>Edit</button>
              <button onClick={() => deleteUser(user.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
