export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <div className="logo">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/35ffbd91b802e556e729776a9b26d95a49b76e03?placeholderIfAbsent=true"
              className="logo-image"
              alt="CSCVAN Logo"
            />
            <span className="logo-text">CSCVAN</span>
          </div>

          <div className="contact-item">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ec419dbb12859e4518a10f0db590a659ab73e0e4?placeholderIfAbsent=true"
              className="contact-icon"
              alt="Address Icon"
            />
            <div className="contact-text">
              <span className="contact-label">Address</span>
              <span className="contact-value">replace here</span>
            </div>
          </div>

          <div className="contact-item">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/a310535624d08bcffc83437f86196c0bf38b5d31?placeholderIfAbsent=true"
              className="contact-icon"
              alt="Email Icon"
            />
            <div className="contact-text">
              <span className="contact-label">Email</span>
              <span className="contact-value">replcehere@ucla.edu</span>
            </div>
          </div>

          <div className="contact-item">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/000899e96c0a11bc8b192f42704145edb1467b6d?placeholderIfAbsent=true"
              className="contact-icon"
              alt="Phone Icon"
            />
            <div className="contact-text">
              <span className="contact-label">Phone</span>
              <span className="contact-value">+537 547-6401</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
