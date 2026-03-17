import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './contact.css';

export default function ContactPage() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // hook up to API when ready
  }

  return (
    <>
      <Navbar />
      <main>
        <img src="/assets/contact/banner-mobile.png" alt="banner" />
        <div className="contact-pc">
          <h2 className="montserrat-semi-bold">Get in Touch</h2>
          <p className="montserrat-regular">
            Whether you have a question, or would like to say hello, we're happy to hear from you. Please use the form to
            send us a message and we'll get back to you as soon as we can. Whether you have a question, or would like to say hello,
            we're happy to hear from you. Please use the form to send us a message and we'll get back to you as soon as we can.
          </p>
          <form className="info-form" onSubmit={handleSubmit}>
            <div className="payment-details">
              <label htmlFor="contact-name" className="montserrat-regular">*Your Name</label>
              <input
                type="text"
                id="contact-name"
                placeholder="First and last name"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <label htmlFor="contact-email" className="montserrat-regular">*Your Email</label>
              <input
                type="email"
                id="contact-email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <label htmlFor="contact-subject" className="montserrat-regular">*Subject</label>
              <input
                type="text"
                id="contact-subject"
                placeholder="Enter subject"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
              <label htmlFor="contact-message" className="montserrat-regular">*Message</label>
              <textarea
                id="contact-message"
                placeholder="Enter your message"
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
          </form>
          <button id="btn" className="next-btn" onClick={handleSubmit}>
            SEND MESSAGE <img src="/assets/icons/image.png" alt="Send" />
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
