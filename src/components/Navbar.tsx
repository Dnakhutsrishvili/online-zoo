import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import SigninModal from './SigninModal';

export default function Navbar() {
  const { user, logout }         = useUser();
  const [popupOpen, setPopupOpen] = useState(false);
  const [signinOpen, setSigninOpen] = useState(false);
  const location = useLocation();

  function isActive(path: string) {
    return location.pathname === path ? { color: '#00A092' } : undefined;
  }

  return (
    <>
      <header className="navbar">
        <div className="logo">
          <img src="/assets/icons/main-logo.png" alt="Logo" />
        </div>
        <input type="checkbox" id="menu-toggle" className="menu-toggle" />
        <label htmlFor="menu-toggle" className="burger">
          <span></span>
          <span></span>
          <span></span>
        </label>

        <ul className="nav-links montserrat-semi-bold">
          <li><Link style={isActive('/')} to="/">ABOUT</Link></li>
          <li><Link style={isActive('/map')} to="/map">MAP</Link></li>
          <li><Link style={isActive('/animal')} to="/animal">ZOOS</Link></li>
          <li><Link style={isActive('/contact')} to="/contact">CONTACT US</Link></li>
        </ul>

        <ul className="social-media-header">
          <li><a href="https://www.facebook.com/" target="_blank" rel="noreferrer"><img src="/assets/icons/facebook.png" alt="Facebook" /></a></li>
          <li><a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><img src="/assets/icons/instagram.png" alt="Instagram" /></a></li>
          <li><a href="https://www.youtube.com/" target="_blank" rel="noreferrer"><img src="/assets/icons/youtube.png" alt="YouTube" /></a></li>
        </ul>

        <div className="user-widget" id="user-widget">
          <button
            className="user-btn"
            id="user-btn"
            aria-label="User menu"
            aria-expanded={popupOpen}
            onClick={e => { e.stopPropagation(); setPopupOpen(p => !p); }}
          >
            <svg className="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            {user && <span className="user-name montserrat-semi-bold">{user.name}</span>}
          </button>

          {popupOpen && (
            <div className="user-popup open" id="user-popup" role="menu" onClick={e => e.stopPropagation()}>
              {!user ? (
                <div className="popup-guest active" id="popup-guest">
                  <button
                    className="popup-option montserrat-semi-bold"
                    onClick={() => { setPopupOpen(false); setSigninOpen(true); }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                      <polyline points="10 17 15 12 10 7"/>
                      <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    Sign In
                  </button>
                  <div className="popup-divider"></div>
                  <Link to="/registration" className="popup-option montserrat-semi-bold" onClick={() => setPopupOpen(false)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <line x1="19" y1="8" x2="19" y2="14"/>
                      <line x1="22" y1="11" x2="16" y2="11"/>
                    </svg>
                    Registration
                  </Link>
                </div>
              ) : (
                <div className="popup-user active" id="popup-user">
                  <div className="popup-profile">
                    <div className="popup-avatar">{user.name.charAt(0).toUpperCase()}</div>
                    <div className="popup-info">
                      <p className="popup-info-name montserrat-semi-bold">{user.name}</p>
                      <p className="popup-info-email montserrat-regular">{user.email}</p>
                    </div>
                  </div>
                  <div className="popup-divider"></div>
                  <button className="popup-signout montserrat-semi-bold" onClick={() => { logout(); setPopupOpen(false); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <SigninModal isOpen={signinOpen} onClose={() => setSigninOpen(false)} />
    </>
  );
}