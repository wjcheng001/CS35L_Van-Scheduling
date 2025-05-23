import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/home.css";


export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="home-container">
        <div className="home-content">
          <Header />

          <button
            className="dashboard-button"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>

          <button
            className="profile-button"
            onClick={() => navigate("/profile")}
          >
            Go to Profile
          </button>

          <Footer />
        </div>
      </div>
    
    <div className="home-container">
      <div className="home-content">
        <Header />

        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-images">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5111756f4f808c7155b6a155ab842593e86e0783?placeholderIfAbsent=true"
                className="hero-main-image"
                alt="Van illustration"
              />
            </div>
            <div className="hero-text-container">
              <div className="hero-text-content">
                <div className="hero-text-wrapper">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/194072885896dd90366ebb4deb2e23cdcad47a36?placeholderIfAbsent=true"
                    className="hero-background-image"
                    alt="Background pattern"
                  />
                  <h1 className="hero-title">
                    Reserve UCLA Vans for Your Project
                  </h1>
                  <p className="hero-description">
                    Free, safe, and convenient transportation for approved
                    project members
                  </p>
                </div>
                <button
                  className="login-button"
                  onClick={() => navigate("/login")}
                >
                  Log in with UCLA Email
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="info-section">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3340da322d9c72bbb672cea7710b489c34478699?placeholderIfAbsent=true"
            className="info-image"
            alt="Van information"
          />
          <div className="steps-container">
            <div className="step-item">
              <div className="step-header">
                <div className="step-number">1</div>
                <h3 className="step-title">Apply to drive</h3>
              </div>
              <p className="step-description">
                Fill out a short form with your driving history and upload your
                driving safety course certificate
              </p>
            </div>

            <div className="step-item">
              <div className="step-header">
                <div className="step-number">2</div>
                <h3 className="step-title">Get approved</h3>
              </div>
              <p className="step-description">
                We'll review your application automatically or manually (if
                needed). You'll get an email with the final decision.
              </p>
            </div>

            <div className="step-item">
              <div className="step-header">
                <div className="step-number">3</div>
                <h3 className="step-title">Book a van</h3>
              </div>
              <p className="step-description">
                Once approved, submit a request for a van by selecting a date
                and time.
              </p>
            </div>

            <div className="step-item">
              <div className="step-header">
                <div className="step-number">4</div>
                <h3 className="step-title">Return it digitally</h3>
              </div>
              <p className="step-description">
                After your trip, complete a quick online return form
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
