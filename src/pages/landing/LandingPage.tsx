import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import DonationDialog from '../../components/DonationDialog';
import { LOCAL_IMAGES } from '../../constants/paths';

const API_URL_ANIMAL   = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets';
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

interface Notification {
  message: string;
  success: boolean;
}

export default function LandingPage() {
  const [pets, setPets]                       = useState<Pet[]>([]);
  const [feedback, setFeedback]               = useState<Feedback[]>([]);
  const [petsLoading, setPetsLoading]         = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [donationOpen, setDonationOpen]       = useState(false);
  const [notification, setNotification]       = useState<Notification | null>(null);
  const carouselRef                           = useRef<HTMLDivElement>(null);
  const testimonialRef                        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(API_URL_ANIMAL)
      .then(r => r.json())
      .then(data => {
        const raw = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        const mapped = raw.map((pet: any) => ({
          ...pet,
          image: LOCAL_IMAGES[pet.id] || pet?.image || '/assets/landing/coala-mobile.png',
        }));
        setPets(mapped);
      })
      .catch(console.error)
      .finally(() => setPetsLoading(false));
  }, []);

  useEffect(() => {
    fetch(API_URL_FEEDBACK)
      .then(r => r.json()) // ✅ fixed - was missing this
      .then(data => {
        const raw = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        setFeedback(raw as Feedback[]);
      })
      .catch(console.error)
      .finally(() => setFeedbackLoading(false));
  }, []);

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(t);
  }, [notification]);

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
        <section className="hero">
          <div className="here-text">
            <h2 className="montserrat-heavy">WATCH YOUR FAVORITE ANIMAL ONLINE</h2>
            <p className="montserrat-regular">
              Explore the exciting and mysterious world of wild animals in a natural setting without leaving your home.
            </p>
            <Link to="/animal" className="montserrat-semi-bold">
              VIEW LIVE CAM <img src="/assets/icons/image.png" alt="Go to destination" />
            </Link>
          </div>
        </section>
        <section className="welcome">
          <img src="/assets/landing/welcome-mobile.png" alt="banner" />
          <h2 className="montserrat-regular">Welcome to the Online Zoo!</h2>
          <p className="montserrat-regular">
            On our website, using live webcams, fans of all ages can observe various animals. Among them, are Giant pandas, eagles, alligators, forest gorillas, African lions, and others. It is the whole natural world in real-time in front of our cameras.
          </p>
          <img className="adjust" src="/assets/landing/eagles-mobile.png" alt="banner" />
          <h2 className="montserrat-regular adjust">How we work</h2>
          <p className="montserrat-regular adjust">
            Online Zoo is a nonprofit committed to inspiring awareness and preservation of nature and wild animals in our zoo and worldwide. To continue these efforts, we need your help. We are so grateful to our supporters. All donations, large and small, go a long way to the conservation efforts of our pets.
          </p>
        </section>

        <section className="donation">
          <div>
            <h2 className="montserrat-regular">Your donation makes a difference!</h2>
            <p className="montserrat-regular">
              The Online Zoo's animal webcams are some of the most famous on the internet. Tune in to watch your favourite animals — live, 24/7!
            </p>
          </div>
          <div>
            <h3 className="montserrat-semi-bold">Quick Donate</h3>
            <div className="donation-form">
              <input type="number" placeholder="$ DONATION AMOUNT" />
              <button className="montserrat-semi-bold" onClick={() => setDonationOpen(true)}>
                <img src="/assets/icons/image.png" alt="Donate" />
              </button>
            </div>
          </div>
        </section>

        <section className="contact">
          <h2 className="montserrat-regular">MEET SOME OUR PETS</h2>
          <p className="montserrat-regular">
            Do you have a special place in your heart for animals? Who are your favorites? Perhaps you would like to donate to special ones or all our pets? We think it is important for you to choose how your donation is used.
          </p>
          <div>
            <div className="animal-card remove">
              <div className="animal-name"><h3 className="montserrat-regular">Liz</h3></div>
              <img src="/assets/landing/coala-mobile.png" alt="Koala" />
              <h4 className="montserrat-regular">Australian Koala</h4>
              <p className="montserrat-regular">The elevated walkways bring you to eye level with the koalas as they perch in their forest.</p>
              <Link to="/animal" className="montserrat-semi-bold">
                VIEW LIVE CAM <img src="/assets/icons/arrow.png" alt="Go to destination" />
              </Link>
            </div>
            <div className="animals-wrapper">
              <button id="left" className="arrow-btn" onClick={() => scrollCarousel('left')}>
                <img src="/assets/icons/arrow-dark.png" alt="arrow" />
              </button>
              <button id="right" className="arrow-btn" onClick={() => scrollCarousel('right')}>
                <img src="/assets/icons/arrow-dark.png" alt="arrow" />
              </button>
              <div className="pc-view" id="pc-view" ref={carouselRef}>
                {petsLoading ? (
                  <div id="pets-skeleton" className="pets-skeleton">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="pets-skeleton-card">
                        <div className="skeleton sk-title"></div>
                        <div className="skeleton sk-image"></div>
                        <div className="skeleton sk-sub"></div>
                        <div className="skeleton sk-text"></div>
                        <div className="skeleton sk-text short"></div>
                        <div className="skeleton sk-link"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  pets.map(animal => (
                    <div key={animal.id} className="animal-card">
                      <div><h3 className="montserrat-regular">{animal.name}</h3></div>
                      <img src={animal.image} alt={animal.name} />
                      <h4 className="montserrat-regular">{animal.commonName}</h4>
                      <p className="montserrat-regular">{animal.description}</p>
                      <Link to="/animal" className="montserrat-semi-bold">
                        VIEW LIVE CAM <img src="/assets/icons/arrow.png" alt="Go to destination" />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
            <Link to="/animal" className="montserrat-semi-bold pc-btn">
              choose your favorite <img src="/assets/icons/arrow-dark.png" alt="Go to destination" />
            </Link>
          </div>
        </section>

        <section className="pay-and-feed">
          <h2 className="montserrat-regular">PAY AND FEED</h2>
          {[
            { num: '01', img: '/assets/landing/chimp-mobile.png', icon: '/assets/icons/donation.png', title: 'Your donation has an impact', text: 'Providing our animals with high-quality nutritious diets is just one element of animal care at our Zoo. We do all the best so that our animals can eat food similar to what they might find in their natural habitats while making sure they get the right mix of nutrients, proteins, and vitamins to be happy and healthy. Please help us provide nutritious food for our animals by donating.' },
            { num: '02', img: '/assets/landing/banana-mobile.png', icon: '/assets/icons/pay-icon.png', title: 'Make a donation', text: 'You can donate through your credit card without any fees. It is easy and safe. We do not keep donors personal information on an online network. Choose an amount to give and the pets name if needed.' },
            { num: '03', img: '/assets/landing/banana-chimp-mobile.png', icon: '/assets/icons/vegies.png', title: 'Bring your food charity — straight to your favorites pets.', text: 'After your donation, the animal receives its favorite foods. You can support your favorite animals or any animal you care about and make a real personal impact. Never doubt that your donation can make a difference even if it is small.' },
          ].map(item => (
            <div key={item.num}>
              <div className="number-line">
                <h3 className="montserrat-regular">{item.num}</h3>
                <hr />
              </div>
              <div className="pc-flex">
                <img src={item.img} alt={item.title} />
                <div>
                  <img className="feed-icon" src={item.icon} alt={item.title} />
                  <h2 className="montserrat-regular">{item.title}</h2>
                  <p className="montserrat-regular">{item.text}</p>
                </div>
              </div>
            </div>
          ))}

          <button className="donate montserrat-semi-bold" onClick={() => setDonationOpen(true)}>
            DONATE NOW <img src="/assets/icons/image.png" alt="Go to destination" />
          </button>

          <h2 style={{ marginTop: '5rem' }} className="montserrat-regular">what our users think</h2>
          <p className="montserrat-regular">
            We are continuously striving to improve the experiences of our future guests. Below you can leave your own feedback, or simply view feedback from past clients.
          </p>

          <div className="testimonial-section">
            <div className="slider-wrapper">
              <div className="slider" id="testimonial-slider" ref={testimonialRef}>
                {feedbackLoading ? (
                  <div id="testimonials-skeleton" className="testimonials-skeleton">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="testimonials-skeleton-card">
                        <div className="skeleton sk-avatar"></div>
                        <div className="skeleton sk-date"></div>
                        <div className="skeleton sk-line"></div>
                        <div className="skeleton sk-line short"></div>
                        <div className="skeleton sk-name"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  feedback.map((item, i) => (
                    <div key={i} className="slide">
                      <img src="/assets/icons/testemonial.png" alt={"Testimonial " + item.name} />
                      <h4>{item.city}, {item.month} {item.year}</h4>
                      <p>{item.text}</p>
                      <h5>{item.name}</h5>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="buttons" id="slider-buttons"></div>
          </div>

          <button id="testimonial-left" className="arrow-btn" onClick={() => scrollTestimonial('left')}>
            <img src="/assets/icons/arrow-dark.png" alt="arrow" />
          </button>
          <button id="testimonial-right" className="arrow-btn" onClick={() => scrollTestimonial('right')}>
            <img src="/assets/icons/arrow-dark.png" alt="arrow" />
          </button>

          <button
            style={{ backgroundColor: 'var(--blue)', border: '1px solid var(--white)', marginTop: '2rem', zIndex: 999, position: 'relative' }}
            className="montserrat-semi-bold donate"
            onClick={() => setDonationOpen(true)}
          >
            LEAVE FEEDBACK <img src="/assets/icons/image.png" alt="Go to destination" />
          </button>
          <img id="linear-panda" src="/assets/landing/linear-panda.png" alt="Feedback banner" />
        </section>

        <section className="care">
          <h2 className="montserrat-regular">care for the animals you love</h2>
          <p className="montserrat-regular">You can help to look after the animals you love with your gift today</p>
          <img className="coala-pc" src="/assets/landing/coala-pc.png" alt="coala" />
          <div className="animal-section">
            <input type="radio" name="animal-slider" id="animal1" defaultChecked />
            <input type="radio" name="animal-slider" id="animal2" />
            <input type="radio" name="animal-slider" id="animal3" />
            <input type="radio" name="animal-slider" id="animal4" />
            <div className="slider">
              <div className="slides">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="slide">
                    <img src="/assets/landing/panda-slide-mobile.png" alt="animal" />
                    <p className="montserrat-regular">Your $30 could give Lucas a slice of panda cake, made with our secret recipe.</p>
                    <button style={{ backgroundColor: 'var(--blue)' }} className="montserrat-semi-bold" onClick={() => setDonationOpen(true)}>
                      Feed <img src="/assets/icons/arrow.png" alt="Go to destination" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="buttons-animals">
              <label htmlFor="animal1"></label>
              <label htmlFor="animal2"></label>
              <label htmlFor="animal3"></label>
              <label htmlFor="animal4"></label>
            </div>
          </div>
          <button className="montserrat-semi-bold donate" onClick={() => setDonationOpen(true)}>
            Choose Your Favorite <img src="/assets/icons/arrow-dark.png" alt="Go to destination" />
          </button>
        </section>

        <img className="lemur" src="/assets/landing/virtual-call.png" alt="virtual banner" />
      </main>

      <Footer onDonate={() => setDonationOpen(true)} />

      <DonationDialog
        isOpen={donationOpen}
        onClose={() => setDonationOpen(false)}
        pets={pets}
        onNotification={(msg, success) => setNotification({ message: msg, success })}
      />

      {notification && (
        <div className={"donation-notification " + (notification.success ? 'success' : 'error')}>
          {notification.message}
        </div>
      )}
    </>
  );
}