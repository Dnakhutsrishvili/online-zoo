import { useState, type ChangeEvent, type FormEvent } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "./contact.module.css";
import { FormData } from "../../models/animal";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { t } = useTranslation();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <img src="/assets/contact/banner-mobile.png" alt="Contact Us Header" />

        <div className={styles.contact_pc}>
          <h2 className="montserrat-heavy">{t("contact.getIn")}</h2>
          <p className="montserrat-regular">{t("contact.haveQuestion")}</p>
          <form onSubmit={handleSubmit}>
            <div className={styles.field_group}>
              <label htmlFor="name" className="montserrat-semi-bold">
                {t("contact.name")}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("contact.yourName")}
                required
                className={styles.input_field}
              />
            </div>

            <div className={styles.field_group}>
              <label htmlFor="email" className="montserrat-semi-bold">
                {t("contact.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("contact.emailPl")}
                required
                className={styles.input_field}
              />
            </div>

            <div className={styles.field_group}>
              <label htmlFor="subject" className="montserrat-semi-bold">
                {t("contact.subject")}
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder={t("contact.subjectPl")}
                required
                className={styles.input_field}
              />
            </div>

            <div className={styles.field_group}>
              <label htmlFor="message" className="montserrat-semi-bold">
                {t("contact.message")}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t("contact.messagePl")}
                required
                className={styles.textarea}
              />
            </div>

            {submitted && (
              <p className={`montserrat-regular ${styles.success_message}`}>
                {t("contact.thanks")}
              </p>
            )}

            <button
              type="submit"
              className={`montserrat-semi-bold ${styles.btn}`}
              disabled={loading}
            >
              {loading ? t("contact.sending") : t("contact.send")}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
