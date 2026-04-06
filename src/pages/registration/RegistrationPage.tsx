import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  validateLogin,
  validateNameRegistration,
  validateEmailRegistration,
  validatePassword,
} from "../../utils";
import styles from "./registration.module.css";
import SigninModal from "../../components/SigninModal";

const API_URL_REGISTER =
  "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/auth/register";

export default function RegistrationPage() {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loginErr, setLoginErr] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [confirmErr, setConfirmErr] = useState("");
  const [serverErr, setServerErr] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  function validateConfirm(value: string): string {
    if (!value) return "Please confirm your password.";
    if (value !== password) return "Passwords do not match.";
    return "";
  }

  const isValid =
    validateLogin(login) === "" &&
    validateNameRegistration(name) === "" &&
    validateEmailRegistration(email) === "" &&
    validatePassword(password) === "" &&
    validateConfirm(confirm) === "";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerErr("");
    setLoading(true);

    try {
      const response = await fetch(API_URL_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login: login.trim(),
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setServerErr(
          data?.message ||
            data?.error ||
            "Registration failed. Please try again.",
        );
        return;
      }

      navigate("/");
    } catch (err) {
      setServerErr("Something went wrong. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className={styles.register_main}>
        <div className={styles.register_card}>
          <div className={styles.card_accent} />
          <div className={styles.card_body}>
            <h1 className="montserrat-heavy">Create Account</h1>
            <p className={`montserrat-regular ${styles.subtitle}`}>
              Join the Online Zoo community
            </p>

            <form
              id="register-form"
              className={styles.form}
              noValidate
              onSubmit={handleSubmit}
            >
              <div
                className={`${styles.field_group} ${loginErr ? styles.invalid : ""}`}
                id="group-login"
              >
                <label className="montserrat-semi-bold" htmlFor="reg-login">
                  Login
                </label>
                <div className={styles.input_wrap}>
                  <input
                    type="text"
                    id="reg-login"
                    placeholder="e.g. johnDoe"
                    autoComplete="username"
                    value={login}
                    onChange={(e) => {
                      setLogin(e.target.value);
                      setServerErr("");
                    }}
                    onBlur={() => setLoginErr(validateLogin(login))}
                    onFocus={() => setLoginErr("")}
                  />
                  <span className={styles.error_icon} aria-hidden="true">
                    !
                  </span>
                </div>
                {loginErr && (
                  <span className={`${styles.field_error} montserrat-regular`}>
                    {loginErr}
                  </span>
                )}
              </div>
              <div
                className={`${styles.field_group} ${nameErr ? styles.invalid : ""}`}
                id="group-name"
              >
                <label className="montserrat-semi-bold" htmlFor="reg-name">
                  Name
                </label>
                <div className={styles.input_wrap}>
                  <input
                    type="text"
                    id="reg-name"
                    placeholder="e.g. John"
                    autoComplete="given-name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setServerErr("");
                    }}
                    onBlur={() => setNameErr(validateNameRegistration(name))}
                    onFocus={() => setNameErr("")}
                  />
                  <span className={styles.error_icon} aria-hidden="true">
                    !
                  </span>
                </div>
                {nameErr && (
                  <span className={`${styles.field_error} montserrat-regular`}>
                    {nameErr}
                  </span>
                )}
              </div>
              <div
                className={`${styles.field_group} ${emailErr ? styles.invalid : ""}`}
                id="group-email"
              >
                <label className="montserrat-semi-bold" htmlFor="reg-email">
                  Email
                </label>
                <div className={styles.input_wrap}>
                  <input
                    type="email"
                    id="reg-email"
                    placeholder="e.g. john@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setServerErr("");
                    }}
                    onBlur={() => setEmailErr(validateEmailRegistration(email))}
                    onFocus={() => setEmailErr("")}
                  />
                  <span className={styles.error_icon} aria-hidden="true">
                    !
                  </span>
                </div>
                {emailErr && (
                  <span className={`${styles.field_error} montserrat-regular`}>
                    {emailErr}
                  </span>
                )}
              </div>
              <div
                className={`${styles.field_group} ${passwordErr ? styles.invalid : ""}`}
                id="group-password"
              >
                <label className="montserrat-semi-bold" htmlFor="reg-password">
                  Password
                </label>
                <div className={styles.input_wrap}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="reg-password"
                    placeholder="Min. 6 chars + special character"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setServerErr("");
                    }}
                    onBlur={() => {
                      setPasswordErr(validatePassword(password));
                      if (confirm) setConfirmErr(validateConfirm(confirm));
                    }}
                    onFocus={() => setPasswordErr("")}
                  />
                  <button
                    type="button"
                    className={styles.toggle_pw}
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <span className={styles.error_icon} aria-hidden="true">
                    !
                  </span>
                </div>
                {passwordErr && (
                  <span className={`${styles.field_error} montserrat-regular`}>
                    {passwordErr}
                  </span>
                )}
              </div>
              <div
                className={`${styles.field_group} ${confirmErr ? styles.invalid : ""}`}
                id="group-confirm"
              >
                <label className="montserrat-semi-bold" htmlFor="reg-confirm">
                  Confirm Password
                </label>
                <div className={styles.input_wrap}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    id="reg-confirm"
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      setServerErr("");
                    }}
                    onBlur={() => setConfirmErr(validateConfirm(confirm))}
                    onFocus={() => setConfirmErr("")}
                  />
                  <button
                    type="button"
                    className={styles.toggle_pw}
                    onClick={() => setShowConfirm((p) => !p)}
                    aria-label={
                      showConfirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <span className={styles.error_icon} aria-hidden="true">
                    !
                  </span>
                </div>
                {confirmErr && (
                  <span className={`${styles.field_error} montserrat-regular`}>
                    {confirmErr}
                  </span>
                )}
              </div>
              {serverErr && (
                <p className={`${styles.server_error} montserrat-regular`}>
                  {serverErr}
                </p>
              )}
              <button
                type="submit"
                className={`${styles.register_btn} montserrat-semi-bold`}
                disabled={!isValid || loading}
              >
                {loading ? "Registering…" : "REGISTER"}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            <p className={`montserrat-regular ${styles.login_link}`}>
              Already have an account?{" "}
              <button
                className={styles.linkBtn}
                onClick={() => setIsModalOpen(true)}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
        <SigninModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </main>
    </>
  );
}
