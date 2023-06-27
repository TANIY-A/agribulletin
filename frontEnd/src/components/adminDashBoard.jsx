import React, { useState } from 'react';
import { PhoneOutlined, MessageOutlined, NotificationOutlined, FilePdfOutlined, DeleteOutlined } from '@ant-design/icons';
import { Divider, Input, Checkbox, Button, Form, message, Modal, Table } from 'antd';
import './Admin.css';
import Complaint1 from './Complaint1';

const AdminDashboard = () => {
  const [messageText, setMessageText] = useState('');
  const [automatedCall, setAutomatedCall] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [notificationUpdate, setNotificationUpdate] = useState(false);
  const [schemePDF, setSchemePDF] = useState(null);
  const [schemeSubmitted, setSchemeSubmitted] = useState(false);
  const [schemeData, setSchemeData] = useState(null);
  const [members, setMembers] = useState([]);
  const [viewComplaints, setViewComplaints] = useState(false);
  const [viewMembers, setViewMembers] = useState(false);
  const [addMemberVisible, setAddMemberVisible] = useState(false);

  const handleMakeChanges = () => {
    if (automatedCall) {
      console.log('Trigger automated call');
      // Perform automated call functionality
    }

    if (messageSent) {
      console.log('Send message:', messageText);
      // Send the message
    }

    if (notificationUpdate) {
      console.log('Update notification');
      // Perform notification update
    }

    if (schemeSubmitted) {
      console.log('Submit scheme:', schemeData);
      // Perform the necessary logic to save the scheme into the database
      // You can use the schemeData file object to upload the file to a server or perform any other required operation

      // Show success message or perform any other required action
      message.success('Scheme submitted successfully');
      setSchemeSubmitted(false);
      setSchemeData(null);
    }
  };

  const handleClearMessage = () => {
    setMessageText('');
  };

  const handleClearInput = () => {
    setSchemePDF(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setSchemeData(file);
  };

  const handleAddMember = () => {
    setAddMemberVisible(true);
  };

  const handleToggleComplaints = () => {
    setViewComplaints((prevState) => !prevState);
  };

  const handleViewMembers = () => {
    setViewMembers((prevState) => !prevState);
  };

  const handleAddMemberSubmit = (values) => {
    const newMember = {
      key: Date.now(),
      name: values.name,
      phoneNumber: values.phoneNumber,
      email: values.email,
      address: values.address,
    };

    // Save newMember to the database or perform necessary logic
    setMembers([...members, newMember]);
    message.success('Member added successfully');
    setAddMemberVisible(false);
  };

  const handleRemoveMember = (record) => {
    const updatedMembers = members.filter((member) => member.key !== record.key);
    setMembers(updatedMembers);
    message.success('Member removed successfully');

    // Perform the necessary database operation to remove the member from the database
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveMember(record)}
        >
          Remove
        </Button>
      ),
    },
  ];

  const handleLogout = () => {
    window.location.href = '/AdminLogin';
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <Divider className="section-divider">Notification Update</Divider>
      <div className="notification-update">
        <Input.TextArea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Enter your message"
        />

        <Checkbox
          checked={notificationUpdate}
          onChange={() => setNotificationUpdate(!notificationUpdate)}
          className="notification-checkbox"
        >
          <NotificationOutlined />
          Update Notification
        </Checkbox>

        <Checkbox
          checked={automatedCall}
          onChange={() => setAutomatedCall(!automatedCall)}
          className="notification-checkbox"
        >
          <PhoneOutlined />
          Automated Call
        </Checkbox>

        <Checkbox
          checked={messageSent}
          onChange={() => setMessageSent(!messageSent)}
          className="notification-checkbox"
        >
          <MessageOutlined />
          Message Sent
        </Checkbox>

        <Button type="primary" onClick={handleMakeChanges} className="action-button">
          Make Changes
        </Button>
        <Button type="primary" onClick={handleClearMessage} className="action-button">
          Clear Message
        </Button>
      </div>

      <Divider className="section-divider">Update Scheme</Divider>
      <div className="update-scheme">
        {schemeSubmitted ? (
          <p>Scheme submitted successfully!</p>
        ) : (
          <div
            className="drop-zone"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {schemeData ? (
              <div>
                <FilePdfOutlined style={{ fontSize: '64px', marginBottom: '16px' }} />
                <p>PDF File:</p>
                <p>{schemeData.name}</p>
              </div>
            ) : (
              <div>
                <FilePdfOutlined style={{ fontSize: '64px', marginBottom: '16px' }} />
                <p>Drag and drop a PDF file here</p>
              </div>
            )}
          </div>
        )}

        <Button
          type="primary"
          onClick={() => setSchemeSubmitted(true)}
          className="action-button"
          disabled={!schemeData}
        >
          Submit
        </Button>
        <Button type="primary" onClick={handleClearInput} className="action-button">
          Clear
        </Button>
      </div>

      <Divider className="section-divider">More Functionalities</Divider>
      <div className="more-functionalities">
        <Button onClick={handleToggleComplaints} className="functionality-button">
          {viewComplaints ? 'Close Complaints' : 'View Complaints'}
        </Button>
        <Button onClick={handleAddMember} className="functionality-button">
          Add New Member
        </Button>
        <Button onClick={handleViewMembers} className="functionality-button">
          {viewMembers ? 'Hide Members' : 'View Members'}
        </Button>
      </div>

      {viewComplaints && <Complaint1 />}

      {viewMembers && (
        <div className="members-table">
          <Table columns={columns} dataSource={members} />
        </div>
      )}

      <Modal
        title="Add New Member"
        visible={addMemberVisible}
        onCancel={() => setAddMemberVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddMemberSubmit} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true, message: 'Please enter the phone number' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter the email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please enter the address' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Member
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Button className="logout-button" onClick={handleLogout}>
        Logout
      </Button>
      <footer className="footer">AgriBulletIn</footer>
    </div>
  );
};

export default AdminDashboard;
