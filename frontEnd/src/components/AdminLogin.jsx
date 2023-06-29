import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './AdminLogin.css';
import AdminDashboard from './adminDashBoard';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/token', {
        email: values.email,
        password: values.password,
      });

      const { success, access_token } = response.data;

      if (success) {
        localStorage.setItem('token', access_token);
        setLoggedIn(true);
      }
    } catch (error) {
      console.log(error);
      message.error('Invalid email or password');
    }
  };

  if (loggedIn) {
    return <AdminDashboard />;
  }

  return (
    <div className="admin-login-container">
      <Button
        className="go-back-icon"
        icon={<ArrowLeftOutlined />}
        onClick={() => window.history.back()}
      />
      <Form className="admin-login-form" onFinish={handleSubmit}>
        <h2>Admin Login</h2>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please enter your email' }]}
        >
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminLogin;
