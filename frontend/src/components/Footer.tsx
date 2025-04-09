import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="custom-footer">
      <p className="footer-text">
        © {new Date().getFullYear()} Roomie Match. All rights reserved.
      </p>
      <div className="footer-icons">
        <a
          href="https://www.linkedin.com/in/idanbg/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://github.com/idanbg"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="mailto:idanbengavriel@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Email"
        >
          <FaEnvelope />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
