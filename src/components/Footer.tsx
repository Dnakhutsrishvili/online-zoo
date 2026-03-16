import { Link, useLocation } from 'react-router-dom';

interface FooterProps {
  onDonate?: () => void;
}

export default function Footer({ onDonate }: FooterProps) {
  const location = useLocation();

  function isActive(path: string) {
    return location.pathname === path ? { color: '#00A092' } : undefined;
  }

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-first">
          <div className="footer-logo">
            <img src="/assets/icons/footer-logo.png" alt="Logo" />
            <img src="/assets/icons/footer-yem-mobile.png" alt="Logo" />
            <img src="/assets/icons/rs-logo-mobile.png" alt="Logo" />
          </div>
          <ul className="footer-links">
            <li><Link style={isActive('/')} to="/">ABOUT</Link></li>
            <li><Link style={isActive('/map')} to="/map">MAP</Link></li>
            <li><Link style={isActive('/animal')} to="/animal">ZOOS</Link></li>
            <li><Link style={isActive('/contact')} to="/contact">CONTACT US</Link></li>
            <li><a href="#">DESIGN</a></li>
          </ul>
          <button
            onClick={onDonate}
            style={{ backgroundColor: 'var(--blue)', border: '1px solid var(--white)', marginTop: '2rem', zIndex: 999, position: 'relative' }}
            className="montserrat-semi-bold footer-donate"
          >
            Donate For Volunteers
            <img src="/assets/icons/image.png" alt="Go to destination" />
          </button>
        </div>
        <hr className="coala-pc" />
        <div className="footer-pc">
          <ul className="social-media">
            <li><a href="https://www.facebook.com/" target="_blank" rel="noreferrer"><img src="/assets/icons/facebook.png" alt="Facebook" /></a></li>
            <li><a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><img src="/assets/icons/instagram.png" alt="Instagram" /></a></li>
            <li><a href="https://www.youtube.com/" target="_blank" rel="noreferrer"><img src="/assets/icons/youtube.png" alt="YouTube" /></a></li>
          </ul>
          <hr className="remove" />
          <ul className="copyright">
            <li><p className="montserrat-regular">© 2026 Dinak</p></li>
            <li><p className="montserrat-regular">© 2026 Yem Digital</p></li>
            <li><p className="montserrat-regular">© 2026 RSSchool</p></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}