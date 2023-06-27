import React, { useState } from 'react';
import { Input, Button, List, Select } from 'antd';
import './scheme.css';
const { Search } = Input;
const { Option } = Select;

const schemes = [
  {
    id: 1,
    title: 'Rice Agriculture Development Scheme',
    description: 'The Rice Agriculture Development Scheme aims to enhance rice cultivation in Kerala through various initiatives and support systems. It focuses on improving productivity, providing farmers with technical knowledge, and ensuring the availability of quality planting materials.',
    pdf: 'rice_agriculture.pdf', 
  },
  {
    id: 2,
    title: 'Vegetable Cultivation Development Scheme',
    description: 'The Vegetable Cultivation Development Scheme focuses on promoting vegetable cultivation in Kerala. It includes training programs, distribution of quality seeds, and implementing good agricultural practices to increase vegetable production and meet the growing demand in the state.',
    pdf: 'vegetable_cultivation.pdf', 
  },
  {
    id: 3,
    title: 'Coconut Development Council',
    description: 'The Coconut Development Council works towards the development of the coconut industry in Kerala. It provides support to coconut farmers, encourages coconut-based industries, promotes research and development, and ensures sustainable coconut cultivation practices.',
    pdf: 'coconut_development.pdf', 
  },
  {
    id: 4,
    title: 'Keragram',
    description: 'Keragram is a program initiated by the Department of Agriculture to support the cultivation of various crops, including pulses and tubers. It aims to increase the production of these crops, enhance the income of farmers, and ensure food security in the state.',
    pdf: 'keragram.pdf', 
  },
  {
    id: 5,
    title: 'Spice Development Project',
    description: 'The Spice Development Project focuses on promoting spice cultivation in Kerala, which is renowned for its rich spice heritage. The project includes training, research, market development, and quality control measures to strengthen the spice industry and boost farmers income.',
    pdf: 'spice_development.pdf', 
  },
  {
    id: 6,
    title: 'Hi-Tech Agriculture - Greenhouse, Precision Farming, etc.',
    description: 'The Hi-Tech Agriculture initiative aims to introduce advanced technologies like greenhouse farming and precision farming techniques in Kerala. It promotes the use of modern agricultural practices to enhance productivity, reduce resource consumption, and ensure sustainable agriculture.',
    pdf: 'hi_tech_agriculture.pdf', 
  },
  {
    id: 7,
    title: 'Organic Farming and Good Agricultural Practices (GAP)',
    description: 'The Department of Agriculture promotes organic farming and advocates for good agricultural practices (GAP) in Kerala. It emphasizes the use of organic inputs, minimization of chemical pesticide usage, and sustainable farming methods to produce safe and healthy agricultural products.',
    pdf: 'organic_farming.pdf', 
  },
  {
    id: 8,
    title: 'Market Development and Intervention',
    description: 'The Department of Agriculture focuses on market development and intervention strategies to stabilize prices and ensure fair returns to farmers. It includes activities like market information dissemination, infrastructure development, and market intervention programs for price stability.',
    pdf: 'market_development.pdf', 
  },
  {
    id: 9,
    title: 'Post-Harvest Management and Value Addition',
    description: 'The Department of Agriculture emphasizes post-harvest management and value addition techniques to minimize crop losses and enhance the value of agricultural produce. It promotes proper storage, packaging, processing, and value-added product development to improve marketability and increase farmers income.',
    pdf: 'post_harvest_management.pdf', 
  },
  {
    id: 10,
    title: 'Agricultural Knowledge Dissemination and Human Resource Development',
    description: 'The Department of Agriculture emphasizes knowledge dissemination and human resource development to empower farmers with the latest agricultural techniques and information. It conducts training programs, workshops, and awareness campaigns to enhance farmers skills and promote agricultural innovation.',
    pdf: 'agricultural_knowledge.pdf', 
  },

];

const CardList = ({ onSchemeSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (value) => {
    setFilterCategory(value);
  };

  const filteredSchemes = schemes.filter((scheme) =>
    scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === '' || scheme.category === filterCategory)
  );

  return (
    <div>
      <div className="search-bar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Search
            placeholder="Search schemes"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginRight: 16 }}
          />
          <Select
            style={{ width: 200 }}
            placeholder="Filter by category"
            onChange={handleFilterChange}
            value={filterCategory}
          >
            <Option value="">All</Option>
            <Option value="category1">Category 1</Option>
            <Option value="category2">Category 2</Option>
            {/* Add more category options here */}
          </Select>
        </div>
      </div>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={filteredSchemes}
        renderItem={(scheme) => (
          <List.Item
            key={scheme.id}
            actions={[
              <Button onClick={() => onSchemeSelect(scheme.id)} key={scheme.id}>
                Details
              </Button>,
              <a href={scheme.pdf} target="_blank" rel="noopener noreferrer" key={`${scheme.id}-pdf`}>
                View PDF
              </a>
            ]}
          >
            <List.Item.Meta title={scheme.title} />
          </List.Item>
        )}
      />
    </div>
  );
};

const SchemePage = () => {
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);

  const handleSchemeSelect = (id) => {
    setSelectedSchemeId(id);
  };

  const handleGoBack = () => {
    setSelectedSchemeId(null);
  };

  const selectedScheme = schemes.find((scheme) => scheme.id === selectedSchemeId);

  return (
    <div>
      {!selectedSchemeId && <CardList onSchemeSelect={handleSchemeSelect} />}
      {selectedSchemeId && (
        <div className="scheme-detail">
          <h2>{selectedScheme.title}</h2>
          <p>{selectedScheme.description}</p>
          <Button onClick={handleGoBack}>Go Back</Button>
        </div>
      )}
    </div>
  );
};

export default SchemePage;
