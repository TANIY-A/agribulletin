import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

import './ComplaintForm.css';

const ComplaintForm = () => {
  const [form] = Form.useForm();
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/complaints', values);
      
      if (response.status === 200) {
         setSuccessMessage('Complaint submitted successfully!');
        form.resetFields();
      } else {
        message.error('Failed to submit complaint.');
      }
    } catch (error) {
      message.error('Failed to submit complaint.');
    }
    
  };

  return (
    <div className="complaint-form-container">
      <div className="success-message">{successMessage}</div>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>
        <Form.Item
          name="complaint"
          label="Complaint"
          rules={[{ required: true, message: 'Please enter your complaint' }]}
        >
          <Input.TextArea placeholder="Enter your complaint" rows={4} />
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

export default ComplaintForm;
