import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import SigninModal from "./SigninModal";
import styles from "./navbar.module.css";
import { LanguageSwitcher } from "./LanguageSwitcher";

export default function Navbar() {
  const { user, logout } = useUser();
  const [popupOpen, setPopupOpen] = useState(false);
  const [signinOpen, setSigninOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  function isActive(path: string) {
    return location.pathname === path ? { color: "#00A092" } : undefined;
  }
  function handleClick() {
    navigate("/");
  }

  return (
    <>
      <header className={styles.navbar}>
        <div onClick={handleClick} className={styles.logo}>
          <img src="/assets/icons/main-logo.png" alt="Logo" />
        </div>
        <div>
          <LanguageSwitcher></LanguageSwitcher>
        </div>
        <input type="checkbox" id="menu-toggle" className={styles.menutoggle} />
        <label htmlFor="menu-toggle" className={styles.burger}>
          <span />
          <span />
          <span />
        </label>

        <ul className={`${styles.navLinks} montserrat-semi-bold`}>
          <li>
            <Link style={isActive("/")} to="/">
              ABOUT
            </Link>
          </li>
          <li>
            <Link style={isActive("/map")} to="/map">
              MAP
            </Link>
          </li>
          <li>
            <Link style={isActive("/animal")} to="/animal">
              ZOOS
            </Link>
          </li>
          <li>
            <Link style={isActive("/contact")} to="/contact">
              CONTACT US
            </Link>
          </li>
        </ul>

        <ul className={styles.socialMediaHeader}>
          <li>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/assets/icons/facebook.png" alt="Facebook" />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/assets/icons/instagram.png" alt="Instagram" />
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
              <img src="/assets/icons/youtube.png" alt="YouTube" />
            </a>
          </li>
        </ul>

        <div className={styles.userWidget} id="user-widget">
          <button
            className={styles.userBtn}
            id="user-btn"
            aria-label="User menu"
            aria-expanded={popupOpen}
            onClick={(e) => {
              e.stopPropagation();
              setPopupOpen((p) => !p);
            }}
          >
            <svg
              className={styles.userIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            {user && (
              <span className={`${styles.userName} montserrat-semi-bold`}>
                {user.name}
              </span>
            )}
          </button>

          {popupOpen && (
            <div
              className={`${styles.userPopup} ${popupOpen ? styles.open : ""}`}
              id="user-popup"
              role="menu"
              onClick={(e) => e.stopPropagation()}
            >
              {!user ? (
                <div
                  className={`${styles.popupGuest} ${popupOpen ? styles.active : ""}`}
                  id="popup-guest"
                >
                  <button
                    className={`${styles.popupOption} montserrat-semi-bold`}
                    onClick={() => {
                      setPopupOpen(false);
                      setSigninOpen(true);
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Sign In
                  </button>
                  <div className={styles.popupDivider} />
                  <Link
                    to="/registration"
                    className={`${styles.popupOption} montserrat-semi-bold`}
                    onClick={() => setPopupOpen(false)}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" y1="8" x2="19" y2="14" />
                      <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                    Registration
                  </Link>
                </div>
              ) : (
                <div
                  className={`${styles.popupUser} ${popupOpen ? styles.active : ""}`}
                >
                  <div className={styles.popupProfile}>
                    <div className={styles.popupAvatar}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.popupInfo}>
                      <p
                        className={`${styles.popupInfoName} montserrat-semi-bold`}
                      >
                        {user.name}
                      </p>
                      <p
                        className={`${styles.popupInfoEmail} montserrat-regular`}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    className={`${styles.popupSignout} montserrat-semi-bold`}
                    onClick={() => {
                      logout();
                      setPopupOpen(false);
                    }}
                  >
                    {" "}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
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
