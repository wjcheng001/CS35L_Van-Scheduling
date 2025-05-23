import React from "react";
import "./dashboard.css"; // Optional CSS file if you'd like to style separately

function TimeCard({ title, onClick }) {
  return (
    <div className="time-card" onClick={onClick}>
      <h2>{title}</h2>
      <p>Tap to find a van schedule</p>
    </div>
  );
}

export default function DashboardScreen() {
  const handleCardClick = (label) => {
    console.log(`Clicked on: ${label}`);
    // TODO: Navigate or open modal, etc.
  };

  const handleReset = () => {
    console.log("Reset clicked");
    // TODO: Add your reset logic
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <button className="settings-button">⚙️</button>
      </div>

      <div className="dashboard-content">
        {["Morning", "Afternoon", "Evening", "Night"].map((label) => (
          <TimeCard key={label} title={label} onClick={() => handleCardClick(label)} />
        ))}
      </div>

      <button className="fab-button" onClick={handleReset}>
        🔄 Restart
      </button>
    </div>
  );
}

