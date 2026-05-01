import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimalSlider from "./AnimalSlider";
import { useDonation } from "../../context/DonationContext";
import { LOCAL_IMAGES } from "../../constants/paths";
import styles from "./landingPage.module.css";
import { Pet, Feedback } from "../../models/animal";
import { useTranslation } from "react-i18next";

const API_URL_ANIMAL =
  "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets";
const API_URL_FEEDBACK =
  "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/feedback";

export default function LandingPage() {
  const { openDonation } = useDonation();
  const { t } = useTranslation();

  const [pets, setPets] = useState<Pet[]>([]);
  const [petError, setPetError] = useState<string>(
    "somthing went wrong, please refresh the page",
  );
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(API_URL_ANIMAL)
      .then((r) => r.json())
      .then((data) => {
        const raw = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];
        const mapped = raw.map((pet: any) => ({
          ...pet,
          image:
            LOCAL_IMAGES[pet.id] ||
            pet?.image ||
            "/assets/landing/coala-mobile.png",
        }));
        setPets(mapped);
      })
      .catch((err) => {
        console.error("Pets API Error:", err);
        setPetError(err);
      })
      .finally(() => setPetsLoading(false));
  }, []);

  useEffect(() => {
    fetch(API_URL_FEEDBACK)
      .then((r) => r.json())
      .then((data) => {
        const raw = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];
        setFeedback(raw as Feedback[]);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setFeedbackLoading(false));
  }, []);

  function scrollCarousel(dir: "left" | "right") {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const isEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    const isStart = el.scrollLeft <= 0;
    if (dir === "right") {
      isEnd
        ? el.scrollTo({ left: 0, behavior: "smooth" })
        : el.scrollBy({ left: 250, behavior: "smooth" });
    } else {
      isStart
        ? el.scrollTo({ left: el.scrollWidth, behavior: "smooth" })
        : el.scrollBy({ left: -250, behavior: "smooth" });
    }
  }

  function scrollTestimonial(dir: "left" | "right") {
    if (!testimonialRef.current) return;
    const el = testimonialRef.current;
    const isEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    const isStart = el.scrollLeft <= 0;
    if (dir === "right") {
      isEnd
        ? el.scrollTo({ left: 0, behavior: "smooth" })
        : el.scrollBy({ left: 250, behavior: "smooth" });
    } else {
      isStart
        ? el.scrollTo({ left: el.scrollWidth, behavior: "smooth" })
        : el.scrollBy({ left: -250, behavior: "smooth" });
    }
  }

  return (
    <>
      <Navbar />
      <main>
        <section className={styles.hero}>
          <div className={styles.hero_text}>
            <h2 className="montserrat-heavy">
              {t("hero.watchFavoriteAnimal")}
            </h2>
            <p className="montserrat-regular">{t("hero.explore")}</p>
            <Link to="/animal" className="montserrat-semi-bold">
              {t("hero.viewLiveCam")}
              <img src="/assets/icons/image.png" alt="Go to destination" />
            </Link>
          </div>
        </section>
        <section className={styles.welcome}>
          <img src="/assets/landing/welcome-mobile.png" alt="banner" />
          <h2 className="montserrat-regular">{t("landing.welcome")}</h2>
          <p className="montserrat-regular">{t("landing.Website")}</p>
          <img
            className={styles.adjust}
            src="/assets/landing/eagles-mobile.png"
            alt="banner"
          />
          <h2 className="montserrat-regular">{t("landing.howWeWork")}</h2>
          <p className="montserrat-regular">{t("landing.online")}</p>
        </section>

        <section className={styles.donation}>
          <div>
            <h2 className="montserrat-regular">{t("landing.yourDonation")}</h2>
            <p className="montserrat-regular">{t("landing.theOnlineZoo")}</p>
          </div>
          <div>
            <h3 className="montserrat-semi-bold">{t("landing.quickDonate")}</h3>
            <div className={styles.donation_form}>
              <input
                type="number"
                placeholder={t("landing.donationPlaceholder")}
              />
              <button className="montserrat-semi-bold" onClick={openDonation}>
                <img src="/assets/icons/image.png" alt="Donate" />
              </button>
            </div>
          </div>
        </section>

        <section className={styles.contact}>
          <h2 className="montserrat-regular">{t("landing.meetSome")}</h2>
          <p className="montserrat-regular">{t("landing.doYouHave")}</p>
          <div>
            <div className={styles.animals_wrapper}>
              <div className={styles.btn_wrapper}>
                <button
                  className={`${styles.arrow_btn} ${styles.left}`}
                  onClick={() => scrollCarousel("left")}
                >
                  <img src="/assets/icons/arrow-dark.png" alt="arrow" />
                </button>
                <button
                  className={`${styles.arrow_btn} ${styles.right}`}
                  onClick={() => scrollCarousel("right")}
                >
                  <img src="/assets/icons/arrow-dark.png" alt="arrow" />
                </button>
              </div>
              <div className={styles.pc_view} id="pc-view" ref={carouselRef}>
                {petsLoading ? (
                  <div id="pets-skeleton" className={styles.pets_skeleton}>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={styles.pets_skeleton_card}>
                        <div
                          className={`${styles.skeleton} ${styles.sk_title}`}
                        />
                        <div
                          className={`${styles.skeleton} ${styles.sk_image}`}
                        />
                        <div
                          className={`${styles.skeleton} ${styles.sk_sub}`}
                        />
                        <div
                          className={`${styles.skeleton} ${styles.sk_text}`}
                        />
                        <div
                          className={`${styles.skeleton} ${styles.sk_text} ${styles.short}`}
                        />
                        <div
                          className={`${styles.skeleton} ${styles.sk_link}`}
                        />
                      </div>
                    ))}
                  </div>
                ) : pets.length == 0 ? (
                  <div className={styles.error}>
                    <p className="montserrat-regular">{petError}</p>
                  </div>
                ) : (
                  pets.map((animal) => (
                    <div key={animal.id} className={styles.animal_card}>
                      <div className={styles.animalName}>
                        <h3 className="montserrat-regular">{animal.name}</h3>
                      </div>
                      <img
                        className={styles.animalImage}
                        src={animal.image}
                        alt={animal.name}
                      />
                      <h4 className="montserrat-regular">
                        {animal.commonName}
                      </h4>
                      <p className="montserrat-regular">{animal.description}</p>
                      <Link to="/animal" className="montserrat-semi-bold">
                        {t("hero.viewLiveCam")}
                        <img
                          src="/assets/icons/arrow.png"
                          alt="Go to destination"
                        />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
            <button className={`montserrat-semi-bold ${styles.pc_btn}`}>
              {t("landing.chooseYourFavorite")}
              <img src="/assets/icons/arrow-dark.png" alt="Go to destination" />
            </button>
          </div>
        </section>

        <section className={styles.pay_and_feed}>
          <h2 className="montserrat-regular">{t("landing.payAndFeed")}</h2>
          {[
            {
              num: "01",
              img: "/assets/landing/chimp-mobile.png",
              icon: "/assets/icons/donation.png",
              title: t("landing.title1"),
              text: t("landing.text1"),
            },
            {
              num: "02",
              img: "/assets/landing/banana-mobile.png",
              icon: "/assets/icons/pay-icon.png",
              title: t("landing.title2"),
              text: t("landing.text2"),
            },
            {
              num: "03",
              img: "/assets/landing/banana-chimp-mobile.png",
              icon: "/assets/icons/vegies.png",
              title: t("landing.title3"),
              text: t("landing.text3"),
            },
          ].map((item) => (
            <div key={item.num}>
              <div className={styles.number_line}>
                <h3 className="montserrat-regular">{item.num}</h3>
                <hr />
              </div>
              <div className={styles.pc_flex}>
                <img
                  className={styles.banner}
                  src={item.img}
                  alt={item.title}
                />
                <div>
                  <img
                    className={styles.feed_icon}
                    src={item.icon}
                    alt={item.title}
                  />
                  <h2 className="montserrat-regular">{item.title}</h2>
                  <p className="montserrat-regular">{item.text}</p>
                </div>
              </div>
            </div>
          ))}

          <button
            className={`${styles.donate} montserrat-semi-bold`}
            onClick={openDonation}
          >
            {t("landing.donateNow")}
            <img src="/assets/icons/image.png" alt="Go to destination" />
          </button>

          <h2 style={{ marginTop: "5rem" }} className="montserrat-regular">
            {t("landing.WhatOurUsers")}
          </h2>
          <p className="montserrat-regular">{t("landing.weAre")}</p>

          <div className={styles.testimonial_section}>
            <div className={styles.slider_wrapper}>
              <div
                className={styles.slider}
                id="testimonial-slider"
                ref={testimonialRef}
              >
                {feedbackLoading ? (
                  <div
                    id="testimonials-skeleton"
                    className={styles.testimonials_skeleton}
                  >
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={styles.testimonials_skeleton_card}
                      >
                        <div
                          className={`${styles.skeleton} ${styles.sk_avatar}`}
                        />
                        <div
                          className={`${styles.skeleton} ${styles.sk_date}`}
                        />
                        <div
                          className={`${styles.skeleton} ${styles.sk_line}`}
                        />
                        <div
                          className={`${styles.skeleton} ${styles.sk_line} ${styles.short}`}
                        />
                        <div
                          className={`${styles.skeleton} ${styles.sk_name}`}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  feedback.map((item, i) => (
                    <div
                      key={i}
                      className={`${i !== 0 ? styles.slide : styles.slide}`}
                    >
                      <img
                        src="/assets/icons/testemonial.png"
                        alt={`Testimonial ${item.name}`}
                      />
                      <h4>
                        {item.city}, {item.month} {item.year}
                      </h4>
                      <p>{item.text}</p>
                      <h5>{item.name}</h5>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className={styles.btn_wrapper}>
              <button
                className={styles.arrow_btn}
                onClick={() => scrollTestimonial("left")}
              >
                <img
                  className={styles.leftArrow}
                  src="/assets/icons/image.png"
                  alt="arrow"
                />
              </button>
              <button
                className={styles.arrow_btn}
                onClick={() => scrollTestimonial("right")}
              >
                <img src="/assets/icons/image.png" alt="arrow" />
              </button>
            </div>
          </div>

          <button
            className={`montserrat-semi-bold ${styles.donate}`}
            onClick={openDonation}
            style={{ marginTop: "2rem" }}
          >
            {t("landing.leaveFeedback")}
            <img src="/assets/icons/image.png" alt="Go to destination" />
          </button>
          <img
            id="linear-panda"
            className={styles.linear_panda}
            src="/assets/landing/linear-panda.png"
            alt="Feedback banner"
          />
        </section>

        <AnimalSlider openDonation={openDonation} />

        <img
          className={styles.lemur}
          src="/assets/landing/virtual-call.png"
          alt="virtual banner"
        />
      </main>

      <Footer />
    </>
  );
}
