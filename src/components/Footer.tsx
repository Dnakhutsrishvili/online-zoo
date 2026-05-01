import { Link, useLocation } from "react-router-dom";
import { useDonation } from "../context/DonationContext";
import styles from "./footer.module.css";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const location = useLocation();
  const { openDonation } = useDonation();
  const { t } = useTranslation();

  function isActive(path: string) {
    return location.pathname === path ? { color: "#00A092" } : undefined;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        <div className={styles.footer_first}>
          <div className={styles.footer_logo}>
            <img src="/assets/icons/footer-logo.png" alt="Logo" />
            <img
              src="/assets/icons/footer-yem-mobile.png"
              alt="Yem Digital Logo"
            />
            <img src="/assets/icons/rs-logo-mobile.png" alt="RS School Logo" />
          </div>
          <ul className={styles.footer_links}>
            <li>
              <Link style={isActive("/")} to="/">
                {t("header.about")}
              </Link>
            </li>
            <li>
              <Link style={isActive("/map")} to="/map">
                {t("header.map")}
              </Link>
            </li>
            <li>
              <Link style={isActive("/animal")} to="/animal">
                {t("header.zoos")}
              </Link>
            </li>
            <li>
              <Link style={isActive("/contact")} to="/contact">
                {t("header.contact")}
              </Link>
            </li>
            <li>
              <a href="#">{t("header.design")}</a>
            </li>
          </ul>
          <button
            onClick={openDonation}
            className={`montserrat-semi-bold ${styles.footer_donate}`}
            style={{
              backgroundColor: "var(--blue)",
              border: "1px solid var(--white)",
              zIndex: 999,
              position: "relative",
            }}
          >
            {t("footer.donate")}
            <img src="/assets/icons/image.png" alt="Go to destination" />
          </button>
        </div>
        <hr className={styles.coala_pc} />
        <div className={styles.footer_pc}>
          <ul className={styles.social_media}>
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
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/assets/icons/youtube.png" alt="YouTube" />
              </a>
            </li>
          </ul>
          <hr className={styles.remove} />
          <ul className={styles.copyright}>
            <li>
              <p className="montserrat-regular">{t("footer.dinak")}</p>
            </li>
            <li>
              <p className="montserrat-regular">{t("footer.digital")}</p>
            </li>
            <li>
              <p className="montserrat-regular">{t("footer.rsSchool")}</p>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
