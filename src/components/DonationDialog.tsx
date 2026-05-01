import { useRef, useEffect, useState, type MouseEvent } from "react";
import { useUser } from "../context/UserContext";
import styles from "./donation.module.css";
import { SavedCard } from "../models/card";
import {
  getSavedCards,
  formatCardLabel,
  validateCardNumber,
  validateCVV,
  validateExpiry,
  validateName,
  validateEmail,
} from "../utils";
import { useTranslation } from "react-i18next";

const API_DONATE =
  "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/donation";

function saveCardToStorage(card: SavedCard) {
  const cards = getSavedCards();
  if (!cards.find((c) => c.cardNumber === card.cardNumber)) {
    cards.push(card);
    localStorage.setItem("zoo-saved-cards", JSON.stringify(cards));
  }
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pets: { id: string; name: string }[];
  onNotification: (msg: string, success: boolean) => void;
}

export default function DonationDialog({
  isOpen,
  onClose,
  pets,
  onNotification,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { user } = useUser();
  const { t } = useTranslation();

  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState("");
  const [petId, setPetId] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [selectedSaved, setSelectedSaved] = useState("");
  const [loading, setLoading] = useState(false);

  const savedCards = getSavedCards();

  const step1Valid = amount !== "" && parseFloat(amount) > 0;
  const step2Valid = validateName(name) && validateEmail(email);
  const step3Valid =
    validateCardNumber(cardNumber) &&
    validateExpiry(expiry) &&
    validateCVV(cvv);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      setStep(0);
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  function handleBackdrop(e: MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose();
  }

  function handleSavedCardSelect(index: string) {
    setSelectedSaved(index);
    if (index !== "") {
      const card = savedCards[parseInt(index)];
      setCardNumber(card.cardNumber);
      setExpiry(card.expiry);
      setCvv(card.cvv);
    } else {
      setCardNumber("");
      setExpiry("");
      setCvv("");
    }
  }

  function handleExpiryInput(val: string) {
    let v = val.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
    setExpiry(v);
  }

  async function handleComplete() {
    if (saveCard) {
      saveCardToStorage({
        cardNumber,
        expiry,
        cvv,
        label: formatCardLabel(cardNumber),
      });
    }
    setLoading(true);
    try {
      const petName = pets.find((p) => p.id === petId)?.name || "";
      const res = await fetch(API_DONATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          petName,
          cardNumber,
          expiry,
          cvv,
        }),
      });
      if (!res.ok) throw new Error();
      onClose();
      onNotification(
        `Thank you for your donation of $${amount}${petName ? ` to ${petName}` : ""}!`,
        true,
      );
    } catch {
      onNotification("Something went wrong. Please try again later.", false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <dialog className={styles.auto} ref={dialogRef} onClick={handleBackdrop}>
      <header className={styles.dialog_header}>
        <h2 className="montserrat-semi-bold">{t("donation.make")}</h2>
      </header>
      <div
        className={`${styles.step} ${styles.step_1} ${step === 0 ? styles.active : ""}`}
      >
        <p className={`montserrat-heavy ${styles.donation_info}`}>
          {t("donation.information")}
        </p>
        <hr />
        <p className="montserrat-regular">
          <span>*</span> {t("donation.choose")}
        </p>

        <div className={styles.donation_options}>
          {["10", "20", "30", "40", "50", "60"].map((v) => (
            <button
              key={v}
              className={`${styles.donation_amount} ${amount === v ? styles.active : ""}`}
              value={v}
              onClick={() => setAmount(v)}
            >
              ${v}
            </button>
          ))}
          <button
            className={styles.donation_amount}
            onClick={() => setAmount("")}
          >
            {t("donation.other")}
          </button>
          <div className={styles.custom_donation_form}>
            <input
              id="donation"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
        </div>

        <button className={styles.special}>{t("donation.forSpecial")}</button>

        <select
          className={styles.pet_select}
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
        >
          <option value="">{t("donation.option")}</option>
          {pets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <div className={styles.checkbox}>
          <input
            type="checkbox"
            id="recurring-donation"
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
          />
          <label htmlFor="recurring-donation" className="montserrat-regular">
            {t("donation.makeMonthly")}
          </label>
        </div>

        <button
          className={styles.next_btn}
          disabled={!step1Valid}
          onClick={() => setStep(1)}
        >
          {t("donation.next")} <img src="/assets/icons/image.png" alt="Next" />
        </button>

        <div className={styles.buttons_step}>
          <label htmlFor="step1" />
          <label htmlFor="step2" />
          <label htmlFor="step3" />
        </div>
      </div>

      <div
        className={`${styles.step} ${styles.step_2} ${step === 1 ? styles.active : ""}`}
      >
        <p className={`montserrat-heavy ${styles.donation_info}`}>
          {t("donation.Information")}
        </p>
        <hr />

        <div className={styles.info_form}>
          <div className={styles.payment_details}>
            <label htmlFor="name-input" className="montserrat-regular">
              {t("donation.name")}
            </label>
            <input
              type="text"
              id="name-input"
              placeholder={t("donation.enterName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="email-input" className="montserrat-regular">
              {t("donation.email")}
            </label>
            <input
              type="email"
              id="email-input"
              placeholder={t("donation.enterEmail")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <p className="montserrat-regular">{t("donation.youWill")}</p>
          </div>
        </div>

        <button
          className={styles.next_btn}
          disabled={!step2Valid}
          onClick={() => setStep(2)}
        >
          {t("donation.next")} <img src="/assets/icons/image.png" alt="Next" />
        </button>
        <button className={styles.prev_btn} onClick={() => setStep(0)}>
          {t("donation.back")}
        </button>
      </div>

      <div
        className={`${styles.step} ${styles.step_3} ${step === 2 ? styles.active : ""}`}
      >
        <p className={`montserrat-heavy ${styles.donation_info}`}>
          {t("donation.Information") + ":"}
        </p>
        <hr />

        {savedCards.length > 0 && (
          <div className={styles.saved_cards_container}>
            <label className="montserrat-regular">
              {t("donation.savedCard")}
            </label>
            <select
              className={styles.saved_cards_select}
              value={selectedSaved}
              onChange={(e) => handleSavedCardSelect(e.target.value)}
            >
              <option value="">{t("donation.selectCard")}</option>
              {savedCards.map((card, i) => (
                <option key={i} value={String(i)}>
                  {card.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.payment_details}>
          <label htmlFor="card-number" className="montserrat-regular">
            {t("donation.cardNumber")}
          </label>
          <input
            type="text"
            id="card-number"
            placeholder="1234567890123456"
            value={cardNumber}
            onChange={(e) =>
              setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))
            }
          />

          <label htmlFor="expiry-date" className="montserrat-regular">
            {t("donation.exDate")}
          </label>
          <input
            type="text"
            id="expiry-date"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => handleExpiryInput(e.target.value)}
          />

          <label htmlFor="cvv" className="montserrat-regular">
            {t("donation.cvv")}
          </label>
          <input
            type="text"
            id="cvv"
            placeholder="123"
            value={cvv}
            onChange={(e) =>
              setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
            }
          />
        </div>

        {user && (
          <div className={styles.save_card_container}>
            <div className={styles.save_card_wrapper}>
              <input
                type="checkbox"
                id="save-card"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
              />
              <label htmlFor="save-card" className="montserrat-regular">
                {t("donation.saveCard")}
              </label>
            </div>
          </div>
        )}

        <button className={styles.prev_btn} onClick={() => setStep(1)}>
          {t("donation.back")}
        </button>

        <div className={styles.complate_donation}>
          <button
            id="complete-donation-btn"
            className={`montserrat-semi-bold ${styles.complete_donation_btn}`}
            disabled={!step3Valid || loading}
            onClick={handleComplete}
          >
            {loading
              ? t("donation.processing")
              : t("donation.complateDonation")}
            <img src="/assets/icons/image.png" alt="Go to destination" />
          </button>
        </div>
      </div>
    </dialog>
  );
}
