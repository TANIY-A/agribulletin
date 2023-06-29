import React, { useState, useEffect } from 'react';
import { List, Button, Input, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;
const { Search } = Input;

const SchemePage = () => {
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/schemes', {
        params: {
          title: searchTerm,
          category: filterCategory,
          type: filterType,
        },
      });
      console.log(response.data);
      setSchemes(response.data);
    } catch (error) {
      console.error('Error fetching schemes:', error);
    }
  };
  const fetchSchemeDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/schemes/${id}`);
      setSelectedScheme(response.data);
    } catch (error) {
      console.error('Error fetching scheme details:', error);
    }
  };

  const handleSchemeSelect = (id) => {
    setSelectedSchemeId(id);
    fetchSchemeDetails(id);
  };

  const handleGoBack = () => {
    setSelectedSchemeId(null);
    setSelectedScheme(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChangeInternal = (filterType, value) => {
    if (filterType === 'category') {
      setFilterCategory(value);
    } else if (filterType === 'type') {
      setFilterType(value);
    }
  };

  const handleFilterChange = async () => {
    try {
      await fetchSchemes();
    } catch (error) {
      console.error('Error fetching filtered schemes:', error);
    }
  };

  return (
    <div>
      {!selectedSchemeId && (
        <div>
          <div className="search-bar">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Search
                placeholder="Search schemes"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ marginRight: 16 }}
              />
              <div style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}>
                <h3 style={{ marginRight: 8 }}>Category:</h3>
                <Select
                  style={{ width: 200 }}
                  placeholder="Filter by category"
                  onChange={(value) => handleFilterChangeInternal('category', value)}
                  value={filterCategory}
                >
                  <Option value="">All</Option>
                  <Option value="ST">ST</Option>
                  <Option value="SC">SC</Option>
                  <Option value="BPL">BPL</Option>
                  <Option value="APL">APL</Option>
                </Select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3 style={{ marginRight: 8 }}>Type:</h3>
                <Select
                  style={{ width: 200 }}
                  placeholder="Filter by type"
                  onChange={(value) => handleFilterChangeInternal('type', value)}
                  value={filterType}
                >
                  <Option value="">All</Option>
                  <Option value="Seed">Seed</Option>
                  <Option value="Sapling">Sapling</Option>
                  <Option value="Fertilizers">Fertilizers</Option>
                  <Option value="Equipments">Equipments</Option>
                </Select>
              </div>
              <Button onClick={handleFilterChange} style={{ marginLeft: 16 }}>
                Apply Filter
              </Button>
            </div>
          </div>

          <List
            itemLayout="vertical"
            size="large"
            dataSource={schemes}
            renderItem={(scheme) => (
              <List.Item
                key={scheme._id}
                actions={[
                  <Button onClick={() => handleSchemeSelect(scheme._id)} key={scheme._id}>
                    Details
                  </Button>,
                ]}
              >
                <List.Item.Meta title={scheme.title} />
              </List.Item>
            )}
          />
        </div>
      )}
      {selectedScheme && (
        <div className="scheme-detail">
          <h2>{selectedScheme.title}</h2>
          <p>{selectedScheme.details}</p>
          <Button onClick={handleGoBack}>Go Back</Button>
        </div>
      )}
    </div>
  );
};

export default SchemePage;