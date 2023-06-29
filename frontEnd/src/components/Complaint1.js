import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'antd';
import axios from 'axios';

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/complaintList');
      setComplaints(response.data);
      console.log(response.data)
    } catch (error) {
      console.log('Error fetching complaints:', error);
    }
  };

  const handleRemoveComplaint = async (complaintId) => {
    try {
      await axios.delete(`http://localhost:5000/api/complaintList/${complaintId}`);
      fetchComplaints();
    } catch (error) {
      console.log('Error removing complaint:', error);
    }
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Complaint',
      dataIndex: 'complaint',
      key: 'complaint',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, complaint) => (
        <Button type="primary" danger onClick={() => handleRemoveComplaint(complaint._id)}>
          Remove complaint
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h3>Complaints</h3>
      <Table
        dataSource={complaints}
        columns={columns}
        onRow={(record) => ({
          onClick: () => handleViewDetails(record),
        })}
      />

      <Modal
        title="Complaint Details"
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => setModalOpen(false)}
      >
        {selectedComplaint && (
          <div>
            <h4>Name: {selectedComplaint.name}</h4>
            <p>Email: {selectedComplaint.email}</p>
            <p>Complaint: {selectedComplaint.complaint}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ComplaintsPage;
