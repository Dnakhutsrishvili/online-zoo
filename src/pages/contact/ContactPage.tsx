import { useState } from 'react'
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import styles from './contact.module.css'


interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <img 
          src="/assets/contact/banner-mobile.png" 
          alt="Contact Us Header" 
        />
        
        <div className={styles.contact_pc}>
          <h2 className="montserrat-heavy">Get In Touch</h2>
          <p className="montserrat-regular">
            Have questions or suggestions? We'd love to hear from you! 
            Send us a message and we'll respond as soon as possible.
          </p>

          <form onSubmit={handleSubmit}>
            <div className={styles.field_group}>
              <label htmlFor="name" className="montserrat-semi-bold">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className={styles.input_field}
              />
            </div>

            <div className={styles.field_group}>
              <label htmlFor="email" className="montserrat-semi-bold">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className={styles.input_field}
              />
            </div>

            <div className={styles.field_group}>
              <label htmlFor="subject" className="montserrat-semi-bold">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                required
                className={styles.input_field}
              />
            </div>

            <div className={styles.field_group}>
              <label htmlFor="message" className="montserrat-semi-bold">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message here..."
                required
                className={styles.textarea}
              />
            </div>

            {submitted && (
              <p className={`montserrat-regular ${styles.success_message}`}>
                ✓ Thank you! We'll get back to you soon.
              </p>
            )}

            <button 
              type="submit" 
              className={`montserrat-semi-bold ${styles.btn}`}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'SEND MESSAGE'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ContactPage