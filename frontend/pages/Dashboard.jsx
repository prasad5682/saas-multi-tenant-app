import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Total Tenants</h3>
            <p>{stats.totalTenants || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Active Subscriptions</h3>
            <p>{stats.activeSubscriptions || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Revenue</h3>
            <p>${stats.revenue || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
