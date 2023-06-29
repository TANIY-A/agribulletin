import React, { useState } from 'react';
import { PhoneOutlined, MessageOutlined, NotificationOutlined, FilePdfOutlined, DeleteOutlined } from '@ant-design/icons';
import { Divider, Input, Checkbox, Button, Form, message, Modal, Table } from 'antd';
import './Admin.css';
import Complaint1 from './Complaint1';
import axios from 'axios';
const AdminDashboard = () => {
  const [messageText, setMessageText] = useState('');
  const [schemeNameNotification, setSchemeNameNotification] = useState('');
  const [automatedCall, setAutomatedCall] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [notificationUpdate, setNotificationUpdate] = useState(false);
  const [schemePDF, setSchemePDF] = useState(null);
  const [schemeSubmitted, setSchemeSubmitted] = useState(false);
  const [schemeData, setSchemeData] = useState(null);
  const [schemeName, setSchemeName] = useState('');
  const [schemeDescription, setSchemeDescription] = useState('');
  const [schemeCategory, setSchemeCategory] = useState('');
  const [members, setMembers] = useState([]);
  const [complaints, setComplaints] = useState([]);
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
    setSchemeName('');
    setSchemeDescription('');
    setSchemeCategory('');
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

  const handleToggleComplaints = async () => {
    setViewComplaints((prevState) => !prevState);
  };

  const handleViewMembers = () => {
    setViewMembers((prevState) => !prevState);
  };

  const handleAddMemberSubmit = (values) => {
    const newMember = {
      name: values.name,
      phoneNumber: values.phoneNumber,
      email: values.email,
      address: values.address,
    };
    axios.post('http://localhost:5000/api/add_member', newMember)
      .then((response) => {
        console.log(response.data);
        message.success('Member added successfully');
        setAddMemberVisible(false);
      })
      .catch((error) => {
        console.error(error);
        message.error('Failed to add member');
      });

    
  };

  const handleRemoveMember = (record) => {
    const updatedMembers = members.filter((member) => member.key !== record.key);
    setMembers(updatedMembers);
    message.success('Member removed successfully');
  };

  const handleRemoveComplaint = (complaint) => {
    const updatedComplaints = complaints.filter((c) => c.id !== complaint.id);
    setComplaints(updatedComplaints);
    message.success('Complaint removed successfully');
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

  const handleLoadURL = () => {
    window.open('https://console.twilio.com/us1/develop/phone-numbers/manage/verified', '_blank');
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

        <Input
          value={schemeNameNotification}
          onChange={(e) => setSchemeNameNotification(e.target.value)}
          placeholder="Enter scheme name"
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
          <div className="drop-zone" onDragOver={handleDragOver} onDrop={handleDrop}>
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

        <Form layout="vertical">
          <Form.Item label="Scheme Name">
            <Input value={schemeName} onChange={(e) => setSchemeName(e.target.value)} />
          </Form.Item>

          <Form.Item label="Description">
            <Input.TextArea value={schemeDescription} onChange={(e) => setSchemeDescription(e.target.value)} />
          </Form.Item>

          <Form.Item label="Category">
            <Input value={schemeCategory} onChange={(e) => setSchemeCategory(e.target.value)} />
          </Form.Item>

          <Button type="primary" onClick={handleClearInput} className="action-button">
            Clear Input
          </Button>

          <Button
            type="primary"
            // disabled={!schemeData || !schemeName || !schemeDescription || !schemeCategory}
            onClick={() => setSchemeSubmitted(true)}
            className="action-button"
          >
            Submit Scheme
          </Button>
        </Form>
      </div>

      <Divider className="section-divider">Manage Members</Divider>
      <div className="manage-members">
        <Button type="primary" onClick={handleAddMember} className="action-button">
          Add Member
        </Button>

        <Button type="primary" onClick={handleViewMembers} className="action-button">
          {viewMembers ? 'Hide Members' : 'View Members'}
        </Button>

        <Button type="primary" onClick={handleLoadURL} className="action-button">
          Register Phno.
        </Button>

        {viewMembers && (
          <Table columns={columns} dataSource={members} pagination={false} className="members-table" />
        )}
      </div>

      <Divider className="section-divider">View Complaints</Divider>
      <div className="view-complaints">
        <Button type="primary" onClick={handleToggleComplaints} className="action-button">
          {viewComplaints ? 'Hide Complaints' : 'View Complaints'}
        </Button>

        {viewComplaints && (

         
            <Complaint1 />
        )}
      </div>

      <Button type="primary" onClick={handleLogout} className="logout-button">
        Logout
      </Button>

      <Modal
        visible={addMemberVisible}
        title="Add Member"
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
            rules={[
              { required: true, message: 'Please enter the email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
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
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
