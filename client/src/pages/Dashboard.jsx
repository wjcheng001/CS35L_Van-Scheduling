import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/dashboard.css";

const BookingCard = ({
  date,
  time,
  project,
  vanNumber,
  status,
  onCancel,
  onPickup,
}) => {
  return (
    <div className="booking-card">
      <div className="booking-info">
        <div>
          Date: <span>{date}</span>
        </div>
        <div>Time: {time}</div>
      </div>
      <div className="project-info">
        Project: {project}
        {vanNumber && <div>Van #: {vanNumber}</div>}
      </div>
      <img
        src={
          status === "Confirmed"
            ? "https://cdn.builder.io/api/v1/image/assets/TEMP/3c9479d61a58507a038f8a8c8367f19f0603dacc?placeholderIfAbsent=true"
            : "https://cdn.builder.io/api/v1/image/assets/TEMP/d7f404513c5b4ecd820ac0e15307fc7aa3fb72d7?placeholderIfAbsent=true"
        }
        alt={status}
        className="status-icon"
      />
      <div className="status-text">{status}</div>
      {status === "Confirmed" && (
        <div className="action-buttons">
          <button className="cancel-btn" onClick={onCancel}>
            cancel
          </button>
          <button className="pickup-btn" onClick={onPickup}>
            pick up
          </button>
        </div>
      )}
    </div>
  );
};

const ReturnCard = ({ date, time, project, status, onReturn }) => {
  return (
    <div className="return-card">
      <div className="return-info">
        <div>
          Date: <span>{date}</span>
        </div>
        <div>Time: {time}</div>
      </div>
      <div className="project-info">Project: {project}</div>
      <img
        src={
          status === "Returned"
            ? "https://cdn.builder.io/api/v1/image/assets/TEMP/5810b8128163adcb949aa5b42230d12340fd3869?placeholderIfAbsent=true"
            : "https://cdn.builder.io/api/v1/image/assets/TEMP/d7f404513c5b4ecd820ac0e15307fc7aa3fb72d7?placeholderIfAbsent=true"
        }
        alt={status}
        className="status-icon"
      />
      <div className="status-text">{status}</div>
      {status === "Unreturned" && (
        <button className="return-btn" onClick={onReturn}>
          return
        </button>
      )}
    </div>
  );
};

function Dashboard() {
  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <h1 className="welcome-title">Welcome!</h1>
        <div className="status-container">
          <div className="status-badge">Approved!</div>
          <div className="status-message">
            You're approved to drive! You can now{" "}
            <span className="highlight">Book a Van.</span>
          </div>
        </div>

        <h2 className="section-title">My Bookings</h2>
        <div className="bookings-container">
          <BookingCard
            date="5/15"
            time="7pm - 10pm"
            project="CSSA Prom"
            vanNumber="405437"
            status="Confirmed"
            onCancel={() => { }}
            onPickup={() => { }}
          />
          <BookingCard
            date="5/15"
            time="7pm - 10pm"
            project="CSSA Prom"
            status="Pending"
          />
          <BookingCard
            date="5/15"
            time="7pm - 10pm"
            project="CSSA Prom"
            status="Rejected"
          />
          <div className="see-more">See More</div>
        </div>

        <h2 className="section-title">Van Return</h2>
        <div className="returns-container">
          <ReturnCard
            date="5/15"
            time="7pm - 10pm"
            project="CSSA Prom"
            status="Returned"
          />
          <ReturnCard
            date="5/15"
            time="7pm - 10pm"
            project="CSSA Prom"
            status="Unreturned"
            onReturn={() => { }}
          />
          <ReturnCard
            date="5/15"
            time="7pm - 10pm"
            project="CSSA Prom"
            status="Unreturned"
            onReturn={() => { }}
          />
          <div className="see-more">See More</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
