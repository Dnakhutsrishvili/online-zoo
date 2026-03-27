import { Link, useLocation } from 'react-router-dom';
import { useDonation } from '../context/DonationContext';
import styles from './footer.module.css';

export default function Footer() {
  const location = useLocation();
  const { openDonation } = useDonation();

  function isActive(path: string) {
    return location.pathname === path ? { color: '#00A092' } : undefined;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        <div className={styles.footer_first}>
          <div className={styles.footer_logo}>
            <img src="/assets/icons/footer-logo.png" alt="Logo" />
            <img src="/assets/icons/footer-yem-mobile.png" alt="Yem Digital Logo" />
            <img src="/assets/icons/rs-logo-mobile.png" alt="RS School Logo" />
          </div>
          <ul className={styles.footer_links}>
            <li><Link style={isActive('/')} to="/">ABOUT</Link></li>
            <li><Link style={isActive('/map')} to="/map">MAP</Link></li>
            <li><Link style={isActive('/animal')} to="/animal">ZOOS</Link></li>
            <li><Link style={isActive('/contact')} to="/contact">CONTACT US</Link></li>
            <li><a href="#">DESIGN</a></li>
          </ul>
          <button
            onClick={openDonation}
            className={`montserrat-semi-bold ${styles.footer_donate}`}
            style={{
              backgroundColor: 'var(--blue)',
              border: '1px solid var(--white)',
              zIndex: 999,
              position: 'relative'
            }}
          >
            Donate For Volunteers
            <img src="/assets/icons/image.png" alt="Go to destination" />
          </button>
        </div>
        <hr className={styles.coala_pc} />
        <div className={styles.footer_pc}>
          <ul className={styles.social_media}>
            <li>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
                <img src="/assets/icons/facebook.png" alt="Facebook" />
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                <img src="/assets/icons/instagram.png" alt="Instagram" />
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
                <img src="/assets/icons/youtube.png" alt="YouTube" />
              </a>
            </li>
          </ul>
          <hr className={styles.remove} />
          <ul className={styles.copyright}>
            <li><p className="montserrat-regular">© 2026 Dinak</p></li>
            <li><p className="montserrat-regular">© 2026 Yem Digital</p></li>
            <li><p className="montserrat-regular">© 2026 RSSchool</p></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
