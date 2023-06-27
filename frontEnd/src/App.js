
// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Scheme from './pages/schemeBar';
import Complaint from './pages/complaint';
import AdminDashboard from './components/adminDashBoard';
import AdminLogin from './components/AdminLogin';

function App() {
  return (
    <Router>
      {/* <Navbar /> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schemes" element={<Scheme />} />
        <Route path="/complaints" element={<Complaint />} />
        <Route path="/AdminLogin" element ={<AdminLogin/>} />
        <Route path="/Component/AdminDashBoard" component={AdminDashboard} />
        {/* <Route path="/adminLogin" element={<AdminLogin />} /> */}
      </Routes>
    </Router>
  );
}

export default App;


