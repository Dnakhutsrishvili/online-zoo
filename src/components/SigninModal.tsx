import { useRef, useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import styles from './singIn.module.css'

const API_URL_LOGIN = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/auth/login';

function validateLogin(value: string): string {
  if (!value.trim()) return 'Login is required';
  if (value.length < 3) return 'Login must be at least 3 characters';
  return '';
}

function validatePassword(value: string): string {
  if (!value) return 'Password is required';
  if (value.length < 6) return 'Password must be at least 6 characters';
  return '';
}

interface SigninModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SigninModal({ isOpen, onClose }: SigninModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { login } = useUser();

  const [loginVal, setLoginVal] = useState('');
  const [passwordVal, setPasswordVal] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [serverErr, setServerErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isValid = validateLogin(loginVal) === '' && validatePassword(passwordVal) === '';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) dialog.showModal();
    else dialog.close();
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerErr('');
    setLoading(true);

    try {
      const response = await fetch(API_URL_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: loginVal.trim(), password: passwordVal }),
      });

      if (!response.ok) {
        setServerErr('Incorrect login or password.');
        return;
      }

      const data = await response.json().catch(() => ({}));
      login({
        name: data?.data?.user?.name || '',
        email: data?.data?.user?.email || '',
      });
      onClose();
    } catch {
      setServerErr('Incorrect login or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <dialog ref={dialogRef} id="signin-modal" className={styles.authModal} onClick={handleBackdropClick}>
      <div className={styles.authModalHeader}>
        <h2 className="montserrat-heavy">Sign In</h2>
        <button className={styles.authModalClose} onClick={onClose} aria-label="Close">&times;</button>
      </div>
      <form className={styles.signinForm} noValidate onSubmit={handleSubmit}>
        <div className={`auth-field-group ${loginErr ? 'invalid' : ''}`} id="auth-group-login">
          <label className="montserrat-semi-bold" htmlFor="signin-login">Login</label>
          <div className={styles.authInputWrap}>
            <input
              type="text"
              id="signin-login"
              placeholder="e.g. johnDoe"
              autoComplete="username"
              value={loginVal}
              onChange={(e) => { setLoginVal(e.target.value); setServerErr(''); }}
              onBlur={() => setLoginErr(validateLogin(loginVal))}
              onFocus={() => setLoginErr('')}
            />
            <span className={styles.authErrorIcon}>!</span>
          </div>
          {loginErr && (
          <span className={`${styles.authFieldError} montserrat-regular`}>
            {loginErr}
          </span>
)}
        </div>

        <div className={`auth-field-group ${passwordErr ? 'invalid' : ''}`} id="auth-group-password">
          <label className="montserrat-semi-bold" htmlFor="signin-password">Password</label>
          <div className={styles.authInputWrap}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="signin-password"
              placeholder="Your password"
              autoComplete="current-password"
              value={passwordVal}
              onChange={(e) => { setPasswordVal(e.target.value); setServerErr(''); }}
              onBlur={() => setPasswordErr(validatePassword(passwordVal))}
              onFocus={() => setPasswordErr('')}
            />
            <button type="button" className={styles.authTogglePw} onClick={() => setShowPassword((p) => !p)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
            <span className={styles.authErrorIcon}>!</span>
          </div>
          {passwordErr && <span className={styles.authFieldError}>{passwordErr}</span>}
        </div>

        {serverErr && <p className={styles.authServerError}>{serverErr}</p>}

        <button type="submit" className={styles.signinSubmit} disabled={!isValid || loading}>
          {loading ? 'Signing in…' : 'SIGN IN'}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </dialog>
  );
}
