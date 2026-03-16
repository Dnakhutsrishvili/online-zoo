import { useRef, useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

const API_DONATE = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/donation';

interface SavedCard {
  cardNumber: string;
  expiry: string;
  cvv: string;
  label: string;
}

function getSavedCards(): SavedCard[] {
  return JSON.parse(localStorage.getItem('zoo-saved-cards') || '[]');
}

function saveCardToStorage(card: SavedCard) {
  const cards = getSavedCards();
  if (!cards.find(c => c.cardNumber === card.cardNumber)) {
    cards.push(card);
    localStorage.setItem('zoo-saved-cards', JSON.stringify(cards));
  }
}

function formatCardLabel(num: string) {
  return '**** **** **** ' + num.slice(-4);
}

function validateCardNumber(v: string) { return /^\d{16}$/.test(v.replace(/\s/g, '')); }
function validateCVV(v: string) { return /^\d{3}$/.test(v); }
function validateExpiry(v: string) {
  if (!/^\d{2}\/\d{2}$/.test(v)) return false;
  const [mm, yy] = v.split('/').map(Number);
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const cy = now.getFullYear() % 100;
  const cm = now.getMonth() + 1;
  return yy > cy || (yy === cy && mm >= cm);
}
function validateName(v: string) { return /^[a-zA-Z\s]+$/.test(v.trim()) && v.trim().length > 0; }
function validateEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pets: { id: string; name: string }[];
  onNotification: (msg: string, success: boolean) => void;
}

export default function DonationDialog({ isOpen, onClose, pets, onNotification }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { user }  = useUser();

  const [step, setStep]               = useState(0);
  const [amount, setAmount]           = useState('');
  const [petId, setPetId]             = useState('');
  const [recurring, setRecurring]     = useState(false);
  const [name, setName]               = useState(user?.name || '');
  const [email, setEmail]             = useState(user?.email || '');
  const [cardNumber, setCardNumber]   = useState('');
  const [expiry, setExpiry]           = useState('');
  const [cvv, setCvv]                 = useState('');
  const [saveCard, setSaveCard]       = useState(false);
  const [selectedSaved, setSelectedSaved] = useState('');
  const [loading, setLoading]         = useState(false);

  const savedCards = getSavedCards();

  const step1Valid = amount !== '' && parseFloat(amount) > 0;
  const step2Valid = validateName(name) && validateEmail(email);
  const step3Valid = validateCardNumber(cardNumber) && validateExpiry(expiry) && validateCVV(cvv);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) { setStep(0); dialog.showModal(); }
    else dialog.close();
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  function handleBackdrop(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose();
  }

  function handleSavedCardSelect(index: string) {
    setSelectedSaved(index);
    if (index !== '') {
      const card = savedCards[parseInt(index)];
      setCardNumber(card.cardNumber);
      setExpiry(card.expiry);
      setCvv(card.cvv);
    } else {
      setCardNumber(''); setExpiry(''); setCvv('');
    }
  }

  function handleExpiryInput(val: string) {
    let v = val.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
    setExpiry(v);
  }

  async function handleComplete() {
    if (saveCard) {
      saveCardToStorage({ cardNumber, expiry, cvv, label: formatCardLabel(cardNumber) });
    }
    setLoading(true);
    try {
      const petName = pets.find(p => p.id === petId)?.name || '';
      const res = await fetch(API_DONATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, petName, cardNumber, expiry, cvv }),
      });
      if (!res.ok) throw new Error();
      onClose();
      onNotification(`Thank you for your donation of $${amount}${petName ? ` to ${petName}` : ''}!`, true);
    } catch {
      onNotification('Something went wrong. Please try again later.', false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <dialog ref={dialogRef} id="donation-dialog" onClick={handleBackdrop}>
      <header className="dialog-header">
        <h2 className="montserrat-semi-bold">make your donation</h2>
      </header>

      {/* Step 1 */}
      <div className={`step step-1 ${step === 0 ? 'active' : ''}`}>
        <p className="montserrat-heavy donation-info">Donation Information</p>
        <hr />
        <p className="montserrat-regular"><span>*</span> choose your donation amount:</p>
        <div className="donation-options">
          {['10','20','30','40','50','60'].map(v => (
            <button
              key={v}
              className={`donation-amount ${amount === v ? 'active' : ''}`}
              value={v}
              onClick={() => setAmount(v)}
            >${v}</button>
          ))}
          <button onClick={() => setAmount('')}>other</button>
          <div className="custom-donation-form">
            <input
              id="donation"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
        </div>
        <button id="special">for special pet</button>
        <select id="pet-select" value={petId} onChange={e => setPetId(e.target.value)}>
          <option value="">Select a pet...</option>
          {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="checkbox">
          <label className="montserrat-regular" htmlFor="recurring-donation">Make this a monthly recurring gift</label>
          <input type="checkbox" id="recurring-donation" checked={recurring} onChange={e => setRecurring(e.target.checked)} />
        </div>
        <button className="next-btn" id="first-step" disabled={!step1Valid} onClick={() => setStep(1)}>
          Next <img src="/assets/icons/image.png" alt="Next" />
        </button>
        <div className="buttons-step">
          <label htmlFor="step1"></label>
          <label htmlFor="step2"></label>
          <label htmlFor="step3"></label>
        </div>
      </div>

      {/* Step 2 */}
      <div className={`step step-2 ${step === 1 ? 'active' : ''}`}>
        <p className="montserrat-heavy donation-info">Payment Information</p>
        <hr />
        <div className="info-form">
          <div className="payment-details">
            <label htmlFor="name-input" className="montserrat-regular">*Your Name</label>
            <input type="text" id="name-input" placeholder="First and last name" value={name} onChange={e => setName(e.target.value)} />
            <label htmlFor="email-input" className="montserrat-regular">*Your Email</label>
            <input type="email" id="email-input" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
            <p className="montserrat-regular">You will receive emails from the Online Zoo, including updates and news on the latest discoveries and translations. You can unsubscribe at any time.</p>
          </div>
        </div>
        <button className="next-btn" id="second-step" disabled={!step2Valid} onClick={() => setStep(2)}>
          Next <img src="/assets/icons/image.png" alt="Next" />
        </button>
        <button className="prev-btn" onClick={() => setStep(0)}>Back</button>
      </div>

      {/* Step 3 */}
      <div className={`step step-3 ${step === 2 ? 'active' : ''}`}>
        <p className="montserrat-heavy donation-info">Payment Information:</p>
        <hr />
        {savedCards.length > 0 && (
          <div id="saved-cards-container">
            <label className="montserrat-regular">Saved cards</label>
            <select className="saved-cards-select" value={selectedSaved} onChange={e => handleSavedCardSelect(e.target.value)}>
              <option value="">Select a saved card...</option>
              {savedCards.map((card, i) => <option key={i} value={String(i)}>{card.label}</option>)}
            </select>
          </div>
        )}
        <div className="payment-details">
          <label htmlFor="card-number" className="montserrat-regular">*Card Number</label>
          <input type="text" id="card-number" placeholder="1234567890123456" value={cardNumber}
            onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))} />
          <label htmlFor="expiry-date" className="montserrat-regular">*Expiry Date</label>
          <input type="text" id="expiry-date" placeholder="MM/YY" value={expiry}
            onChange={e => handleExpiryInput(e.target.value)} />
          <label htmlFor="cvv" className="montserrat-regular">*CVV</label>
          <input type="text" id="cvv" placeholder="123" value={cvv}
            onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} />
        </div>
        {user && (
          <div id="save-card-container">
            <div className="save-card-wrapper">
              <input type="checkbox" id="save-card" checked={saveCard} onChange={e => setSaveCard(e.target.checked)} />
              <label htmlFor="save-card" className="montserrat-regular">Save card info for future donations</label>
            </div>
          </div>
        )}
        <button className="prev-btn" onClick={() => setStep(1)}>Back</button>
        <div className="complate-donation">
          <button id="complete-donation-btn" className="montserrat-semi-bold" disabled={!step3Valid || loading} onClick={handleComplete}>
            {loading ? 'Processing...' : 'COMPLETE DONATION'}
            <img src="/assets/icons/image.png" alt="Go to destination" />
          </button>
        </div>
      </div>
    </dialog>
  );
}