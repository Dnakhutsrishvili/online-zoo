import { useState } from "react";
import styles from "./landingPage.module.css";
import { SLIDES } from "../../constants/paths";
import { useTranslation } from "react-i18next";
type Props = {
  openDonation: () => void;
};

export default function AnimalSlider({ openDonation }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useTranslation();

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className={styles.care}>
      <h2 className="montserrat-regular">{t("landing.careFor")}</h2>
      <p className="montserrat-regular">{t("landing.youCan")}</p>
      <img
        className={styles.coala_pc}
        src="/assets/landing/coala-pc.png"
        alt="coala"
      />

      <div className={styles.animal_section}>
        <div className={styles.slider}>
          <div
            className={styles.slides}
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              transition: "transform 0.5s ease-in-out",
            }}
          >
            {SLIDES.map((slide, i) => (
              <div key={i} className={styles.slide}>
                <img
                  className={styles.heroSlide}
                  src={slide.img}
                  alt={`Slide ${i + 1}`}
                />
                <p className="montserrat-regular">
                  {t(`landing.${slide.text}`)}
                </p>
                <button className="montserrat-semi-bold" onClick={openDonation}>
                  {t("landing.feed")}
                  <img
                    className={styles.slideArrow}
                    src="/assets/icons/arrow.png"
                    alt="Go to destination"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.buttons_animals}>
          {SLIDES.map((_, i) => (
            <label
              key={i}
              htmlFor={`animal${i + 1}`}
              onClick={() => goToSlide(i)}
              style={{
                backgroundColor:
                  i === currentSlide ? "var(--blue)" : "transparent",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>

      <button
        className={`montserrat-semi-bold ${styles.donate}`}
        onClick={openDonation}
      >
        {t("landing.chooseYour")}
        <img src="/assets/icons/arrow-dark.png" alt="Go to destination" />
      </button>
    </section>
  );
}
