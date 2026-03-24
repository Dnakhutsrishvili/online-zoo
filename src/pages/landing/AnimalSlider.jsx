import { useState } from 'react';
import styles from './landingPage.module.css';

export default function AnimalSlider({ openDonation }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      img: '/assets/landing/panda-slide-mobile.png',
      text: 'Your $30 could give Lucas a slice of panda cake, made with our secret recipe.'
    },
    {
      img: '/assets/landing/panda-slide-mobile.png',
      text: 'Your $30 could give Lucas a slice of panda cake, made with our secret recipe.'
    },
    {
      img: '/assets/landing/panda-slide-mobile.png',
      text: 'Your $30 could give Lucas a slice of panda cake, made with our secret recipe.'
    },
    {
      img: '/assets/landing/panda-slide-mobile.png',
      text: 'Your $30 could give Lucas a slice of panda cake, made with our secret recipe.'
    }
  ];

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className={styles.care}>
      <h2 className="montserrat-regular">care for the animals you love</h2>
      <p className="montserrat-regular">You can help to look after the animals you love with your gift today</p>
      <img className={styles.coala_pc} src="/assets/landing/coala-pc.png" alt="coala" />
      
      <div className={styles.animal_section}>
        <div className={styles.slider}>
          <div 
            className={styles.slides}
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              transition: 'transform 0.5s ease-in-out'
            }}
          >
            {slides.map((slide, i) => (
              <div key={i} className={styles.slide}>
                <img className={styles.heroSlide} src={slide.img} alt={`Slide ${i + 1}`} />
                <p className="montserrat-regular">{slide.text}</p>
                <button className="montserrat-semi-bold" onClick={openDonation}>
                  Feed <img className={styles.slideArrow} src="/assets/icons/arrow.png" alt="Go to destination" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.buttons_animals}>
          {slides.map((_, i) => (
            <label
              key={i}
              htmlFor={`animal${i + 1}`}
              onClick={() => goToSlide(i)}
              style={{
                backgroundColor: i === currentSlide ? 'var(--blue)' : 'transparent',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>

      <button className={`montserrat-semi-bold ${styles.donate}`} onClick={openDonation}>
        Choose Your Favorite <img src="/assets/icons/arrow-dark.png" alt="Go to destination" />
      </button>
    </section>
  );
}