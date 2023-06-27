import React, { useState, useEffect } from 'react';
import { Divider, Table, Typography } from 'antd';
import './Complaint1.css';

const Complaints = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchComplaintsFromDatabase()
      .then(complaints => {
        setData(complaints);
      })
      .catch(error => {
        console.error('Error fetching complaints:', error);
      });
  }, []);

  const fetchComplaintsFromDatabase = async () => {
   
    const response = await fetch('http://localhost:5000/api/complaints');
    const data = await response.json();
    return data;
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text, record) => (
        <Typography.Text mark>{text} {record.time}</Typography.Text>
      )
    },
    {
      title: 'Complaint',
      dataIndex: 'complaint',
      key: 'complaint'
    }
  ];

  return (
    <>
      <Divider className="my-divider" orientation="left">Complaint Cell</Divider>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
      />
    </>
  );
};

export default Complaints;
