import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AnimalSlider from './AnimalSlider.jsx';
import { useDonation } from '../../context/DonationContext';
import { LOCAL_IMAGES } from '../../constants/paths';
import styles from './landingPage.module.css';

const API_URL_ANIMAL = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets';
const API_URL_FEEDBACK = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/feedback';

interface Pet {
  id: string;
  name: string;
  commonName: string;
  description: string;
  image?: string;
}

interface Feedback {
  name: string;
  city: string;
  month: string;
  year: string;
  text: string;
}

export default function LandingPage() {
  const { openDonation } = useDonation();

  const [pets, setPets] = useState<Pet[]>([]);
  const [petError, setPetError] = useState<string>('somthing went wrong, please refresh the page');
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(API_URL_ANIMAL)
      .then((r) => r.json())
      .then((data) => {
        const raw = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        const mapped = raw.map((pet: any) => ({
          ...pet,
          image: LOCAL_IMAGES[pet.id] || pet?.image || '/assets/landing/coala-mobile.png',
        }));
        setPets(mapped);
      }).catch((err) => {
  console.error('Pets API Error:', err);
  setPetError(err);
})
.finally(() => setPetsLoading(false));
  }, []);

  useEffect(() => {
    fetch(API_URL_FEEDBACK)
      .then((r) => r.json())
      .then((data) => {
        const raw = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        setFeedback(raw as Feedback[]);
      }).catch((error) => {
  console.error(error);
})
.finally(() => setFeedbackLoading(false));
  }, []);

  function scrollCarousel(dir: 'left' | 'right') {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const isEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    const isStart = el.scrollLeft <= 0;
    if (dir === 'right') {
      isEnd ? el.scrollTo({ left: 0, behavior: 'smooth' }) : el.scrollBy({ left: 250, behavior: 'smooth' });
    } else {
      isStart ? el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' }) : el.scrollBy({ left: -250, behavior: 'smooth' });
    }
  }

  function scrollTestimonial(dir: 'left' | 'right') {
    if (!testimonialRef.current) return;
    const el = testimonialRef.current;
    const isEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    const isStart = el.scrollLeft <= 0;
    if (dir === 'right') {
      isEnd ? el.scrollTo({ left: 0, behavior: 'smooth' }) : el.scrollBy({ left: 250, behavior: 'smooth' });
    } else {
      isStart ? el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' }) : el.scrollBy({ left: -250, behavior: 'smooth' });
    }
  }

  return (
    <>
      <Navbar />

      <main>
        <section className={styles.hero}>
          <div className={styles.hero_text}>
            <h2 className="montserrat-heavy">WATCH YOUR FAVORITE ANIMAL ONLINE</h2>
            <p className="montserrat-regular">
              Explore the exciting and mysterious world of wild animals in a natural setting without leaving your home.
            </p>
            <Link to="/animal" className="montserrat-semi-bold">
              VIEW LIVE CAM
              {' '}
              <img src="/assets/icons/image.png" alt="Go to destination" />
            </Link>
          </div>
        </section>

        <section className={styles.welcome}>
          <img src="/assets/landing/welcome-mobile.png" alt="banner" />
          <h2 className="montserrat-regular">Welcome to the Online Zoo!</h2>
          <p className="montserrat-regular">
            On our website, using live webcams, fans of all ages can observe various animals. Among them, are Giant pandas, eagles, alligators, forest gorillas, African lions, and others. It is the whole natural world in real-time in front of our cameras.
          </p>
          <img className={styles.adjust} src="/assets/landing/eagles-mobile.png" alt="banner" />
          <h2 className="montserrat-regular">How we work</h2>
          <p className="montserrat-regular">
            Online Zoo is a nonprofit committed to inspiring awareness and preservation of nature and wild animals in our zoo and worldwide. To continue these efforts, we need your help. We are so grateful to our supporters. All donations, large and small, go a long way to the conservation efforts of our pets.
          </p>
        </section>

        <section className={styles.donation}>
          <div>
            <h2 className="montserrat-regular">Your donation makes a difference!</h2>
            <p className="montserrat-regular">
              The Online Zoo's animal webcams are some of the most famous on the internet. Tune in to watch your favourite animals — live, 24/7!
            </p>
          </div>
          <div>
            <h3 className="montserrat-semi-bold">Quick Donate</h3>
            <div className={styles.donation_form}>
              <input type="number" placeholder="$ DONATION AMOUNT" />
              <button className="montserrat-semi-bold" onClick={openDonation}>
                <img src="/assets/icons/image.png" alt="Donate" />
              </button>
            </div>
          </div>
        </section>

        <section className={styles.contact}>
          <h2 className="montserrat-regular">MEET SOME OUR PETS</h2>
          <p className="montserrat-regular">
            Do you have a special place in your heart for animals? Who are your favorites? Perhaps you would like to donate to special ones or all our pets? We think it is important for you to choose how your donation is used.
          </p>
          <div>
            <div className={styles.animals_wrapper}>
              <div className={styles.btn_wrapper}>
                <button className={`${styles.arrow_btn} ${styles.left}`} onClick={() => scrollCarousel('left')}>
                  <img src="/assets/icons/arrow-dark.png" alt="arrow" />
                </button>
                <button className={`${styles.arrow_btn} ${styles.right}`} onClick={() => scrollCarousel('right')}>
                  <img src="/assets/icons/arrow-dark.png" alt="arrow" />
                </button>
              </div>
              <div className={styles.pc_view} id="pc-view" ref={carouselRef}>
                {petsLoading ? (
                  <div id="pets-skeleton" className={styles.pets_skeleton}>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={styles.pets_skeleton_card}>
                        <div className={`${styles.skeleton} ${styles.sk_title}`} />
                        <div className={`${styles.skeleton} ${styles.sk_image}`} />
                        <div className={`${styles.skeleton} ${styles.sk_sub}`} />
                        <div className={`${styles.skeleton} ${styles.sk_text}`} />
                        <div className={`${styles.skeleton} ${styles.sk_text} ${styles.short}`} />
                        <div className={`${styles.skeleton} ${styles.sk_link}`} />
                      </div>
    ))}
                  </div>
) : pets.length==0 ? (
  <div className={styles.error}>
    <p className="montserrat-regular">{petError}</p>
  </div>
) : (
  pets.map((animal) => (
    <div key={animal.id} className={styles.animal_card}>
      <div><h3 className="montserrat-regular">{animal.name}</h3></div>
      <img src={animal.image} alt={animal.name} />
      <h4 className="montserrat-regular">{animal.commonName}</h4>
      <p className="montserrat-regular">{animal.description}</p>
      <Link to="/animal" className="montserrat-semi-bold">
        VIEW LIVE CAM
        {' '}
        <img src="/assets/icons/arrow.png" alt="Go to destination" />
      </Link>
    </div>
  ))
)}
              </div>
            </div>
            <button className={`montserrat-semi-bold ${styles.pc_btn}`}>
              choose your favorite
              {' '}
              <img src="/assets/icons/arrow-dark.png" alt="Go to destination" />
            </button>
          </div>
        </section>

        <section className={styles.pay_and_feed}>
          <h2 className="montserrat-regular">PAY AND FEED</h2>
          {[
            {
 num: '01', img: '/assets/landing/chimp-mobile.png', icon: '/assets/icons/donation.png', title: 'Your donation has an impact', text: 'Providing our animals with high-quality nutritious diets is just one element of animal care at our Zoo. We do all the best so that our animals can eat food similar to what they might find in their natural habitats while making sure they get the right mix of nutrients, proteins, and vitamins to be happy and healthy. Please help us provide nutritious food for our animals by donating.'
},
            {
 num: '02', img: '/assets/landing/banana-mobile.png', icon: '/assets/icons/pay-icon.png', title: 'Make a donation', text: 'You can donate through your credit card without any fees. It is easy and safe. We do not keep donors personal information on an online network. Choose an amount to give and the pets name if needed.'
},
            {
 num: '03', img: '/assets/landing/banana-chimp-mobile.png', icon: '/assets/icons/vegies.png', title: 'Bring your food charity — straight to your favorites pets.', text: 'After your donation, the animal receives its favorite foods. You can support your favorite animals or any animal you care about and make a real personal impact. Never doubt that your donation can make a difference even if it is small.'
},
          ].map((item) => (
            <div key={item.num}>
              <div className={styles.number_line}>
                <h3 className="montserrat-regular">{item.num}</h3>
                <hr />
              </div>
              <div className={styles.pc_flex}>
                <img className={styles.banner} src={item.img} alt={item.title} />
                <div>
                  <img className={styles.feed_icon} src={item.icon} alt={item.title} />
                  <h2 className="montserrat-regular">{item.title}</h2>
                  <p className="montserrat-regular">{item.text}</p>
                </div>
              </div>
            </div>
          ))}

          <button className={`${styles.donate} montserrat-semi-bold`} onClick={openDonation}>
            DONATE NOW
            {' '}
            <img src="/assets/icons/image.png" alt="Go to destination" />
          </button>

          <h2 style={{ marginTop: '5rem' }} className="montserrat-regular">what our users think</h2>
          <p className="montserrat-regular">
            We are continuously striving to improve the experiences of our future guests. Below you can leave your own feedback, or simply view feedback from past clients.
          </p>

          <div className={styles.testimonial_section}>
            <div className={styles.slider_wrapper}>
              <div className={styles.slider} id="testimonial-slider" ref={testimonialRef}>
                {feedbackLoading ? (
                  <div id="testimonials-skeleton" className={styles.testimonials_skeleton}>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={styles.testimonials_skeleton_card}>
                        <div className={`${styles.skeleton} ${styles.sk_avatar}`} />
                        <div className={`${styles.skeleton} ${styles.sk_date}`} />
                        <div className={`${styles.skeleton} ${styles.sk_line}`} />
                        <div className={`${styles.skeleton} ${styles.sk_line} ${styles.short}`} />
                        <div className={`${styles.skeleton} ${styles.sk_name}`} />
                      </div>
                    ))}
                  </div>
                ) : (
                  feedback.map((item, i) => (
                    <div key={i} className={`${i !== 0 ? styles.slide : styles.slide}`}>
                      <img src="/assets/icons/testemonial.png" alt={`Testimonial ${item.name}`} />
                      <h4>
                        {item.city}
                        ,
                        {' '}
                        {item.month}
                        {' '}
                        {item.year}
                      </h4>
                      <p>{item.text}</p>
                      <h5>{item.name}</h5>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className={styles.btn_wrapper}>
              <button className={styles.arrow_btn} onClick={() => scrollTestimonial('left')}>
                <img className={styles.leftArrow} src="/assets/icons/image.png" alt="arrow" />
              </button>
              <button className={styles.arrow_btn} onClick={() => scrollTestimonial('right')}>
                <img src="/assets/icons/image.png" alt="arrow" />
              </button>
            </div>
          </div>

          <button
            className={`montserrat-semi-bold ${styles.donate}`}
            onClick={openDonation}
            style={{ marginTop: '2rem' }}
          >
            LEAVE FEEDBACK
            {' '}
            <img src="/assets/icons/image.png" alt="Go to destination" />
          </button>
          <img id="linear-panda" className={styles.linear_panda} src="/assets/landing/linear-panda.png" alt="Feedback banner" />
        </section>

        <AnimalSlider openDonation={openDonation} />

        <img className={styles.lemur} src="/assets/landing/virtual-call.png" alt="virtual banner" />
      </main>

      <Footer />
    </>
  );
}
