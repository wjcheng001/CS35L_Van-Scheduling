import logo from "../images/Text.svg"
import email from "../images/Email.svg"
import phone from "../images/phone.svg"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <div className="logo">
            <img
              src={logo}
              className="logo-image"
              alt="CSCVAN Logo"
            />
            <span className="logo-text">CSCVAN</span>
          </div>

          <div className="contact-item">
            <img
              src={email}
              className="contact-icon"
              alt="Email Icon"
            />
            <div className="contact-text">
              <span className="contact-label">Email</span>
              <span className="contact-value">transportation@uclacsc.org</span>
            </div>
          </div>

          <div className="contact-item">
            <img
              src={phone}
              className="contact-icon"
              alt="Phone Icon"
            />
            <div className="contact-text">
              <span className="contact-label">Director’s Phone</span>
              <span className="contact-value">(510) 828 7036</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
