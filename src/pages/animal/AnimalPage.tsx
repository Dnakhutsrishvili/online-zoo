import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import DonationDialog from '../../components/DonationDialog';
import { LOCAL_IMAGES, LOCAL_ICONS } from '../../constants/paths';
import { Pet, PetDetail } from '../../models/animal';
import './animal-page.css';

const API_PETS      = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets';
const API_PET_BY_ID = (id: string) =>
  `https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets/${id}`;

const ITEMS_COLLAPSED = 4;
const FALLBACK_IMG    = '/assets/landing/coala-mobile.png';

interface Notification {
  message: string;
  success: boolean;
}

export default function AnimalPage() {
  const [allPets, setAllPets]           = useState<Pet[]>([]);
  const [activePetId, setActivePetId]   = useState<string | null>(null);
  const [petDetail, setPetDetail]       = useState<PetDetail | null>(null);
  const [isExpanded, setIsExpanded]     = useState(false);
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const [sidebarError, setSidebarError] = useState('');
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState('');
  const [donationOpen, setDonationOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const visiblePets = isExpanded ? allPets : allPets.slice(0, ITEMS_COLLAPSED);

  const loadPetDetail = useCallback(async (id: string) => {
    setContentLoading(true);
    setContentError('');
    setPetDetail(null);

    try {
      const res = await fetch(API_PET_BY_ID(id));
      if (!res.ok) throw new Error('Failed to fetch pet');

      const json           = await res.json();
      const pet: PetDetail = json.data ?? json;

      setPetDetail({
        ...pet,
        image: LOCAL_IMAGES[Number(id)] || FALLBACK_IMG,
      });

    } catch (err) {
      setContentError('Something went wrong. Please refresh the page.');
      console.error('Pet detail error:', err);
    } finally {
      setContentLoading(false);
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch(API_PETS);
        if (!res.ok) throw new Error('Failed to fetch pets list');

        const json      = await res.json();
        const raw       = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
        const pets: Pet[] = raw;

        setAllPets(pets);

        if (pets.length > 0) {
          setActivePetId(pets[0].id);
          loadPetDetail(pets[0].id);
        }

      } catch (err) {
        setSidebarError('Something went wrong. Please refresh the page.');
        setContentError('Something went wrong. Please refresh the page.');
        console.error('Init error:', err);
      } finally {
        setSidebarLoading(false);
      }
    }

    init();
  }, [loadPetDetail]);

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(t);
  }, [notification]);

  function handlePetClick(id: string) {
    setActivePetId(id);
    loadPetDetail(id);
  }

  const hero = petDetail?.image || (petDetail?.images?.[0]) || FALLBACK_IMG;
  const cam1 = petDetail?.images?.[1] || hero;
  const cam2 = petDetail?.images?.[2] || hero;

  return (
    <>
      <Navbar />

      <div className="page-wrapper">
        <aside className="zoo-sidebar" id="zoo-sidebar">
          {sidebarLoading ? (
            <div className="sidebar-loader" id="sidebar-loader">
              <div className="sidebar-spinner"></div>
            </div>
          ) : sidebarError ? (
            <p className="sidebar-error">{sidebarError}</p>
          ) : (
            <>
              <ul className="sidebar-list" id="sidebar-list">
                {visiblePets.map(pet => (
                  <li
                    key={pet.id}
                    className={`sidebar-item ${activePetId === pet.id ? 'active' : ''}`}
                    onClick={() => handlePetClick(pet.id)}
                  >
                    <img
                      src={LOCAL_ICONS[pet.id] || ''}
                      alt={pet.name}
                      title={pet.name}
                      className="sidebar-icon"
                    />
                  </li>
                ))}
              </ul>

              {allPets.length > ITEMS_COLLAPSED && (
                <button
                  id="sidebar-toggle"
                  className="sidebar-arrow"
                  onClick={() => setIsExpanded(e => !e)}
                >
                  <img
                    src="/assets/icons/arrow.png"
                    alt="Toggle"
                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>
              )}
            </>
          )}
        </aside>

        <main id="zoo-main" className="zoo-main-content">
          {contentLoading && (
            <div className="content-overlay" id="content-overlay">
              <div className="overlay-spinner"></div>
              <span className="montserrat-regular">Loading...</span>
            </div>
          )}

          {petDetail && !contentLoading && (
            <>
              <section id="pet-section" className="visible">
                <h2 className="montserrat-semi-bold">live {petDetail.commonName} cams</h2>
                <a href="#">
                  <img id="pet-hero" src={hero} alt={petDetail.name} />
                </a>
                <h3 className="montserrat-semi-bold">More live views</h3>
                <div className="mini-camera">
                  <a href="#"><img id="pet-cam1" src={cam1} alt="Camera 1" /></a>
                  <a href="#"><img id="pet-cam2" src={cam2} alt="Camera 2" /></a>
                  <a href="#"><img id="pet-cam3" src={hero} alt="Camera 3" /></a>
                </div>
                <button className="donate montserrat-regular" onClick={() => setDonationOpen(true)}>
                  DONATE NOW
                  <img src="/assets/icons/image.png" alt="Go to destination" />
                </button>

                <div className="donation">
                  <h2 className="montserrat-regular">make the {petDetail.commonName || petDetail.name} donation!</h2>
                  <p className="montserrat-regular">{petDetail.description}</p>
                  <h3 className="montserrat-semi-bold">Quick Donate</h3>
                  <div className="donation-form">
                    <input type="number" placeholder="$ DONATION AMOUNT" />
                    <button className="montserrat-semi-bold donate" onClick={() => setDonationOpen(true)}>
                      <img src="/assets/icons/image.png" alt="Donate" />
                    </button>
                  </div>
                </div>
              </section>

              <div className="banner">
                <h3 className="montserrat-semi-bold">did you know?</h3>
                <p className="montserrat-regular">{petDetail.didYouKnow || petDetail.description}</p>
              </div>

              <section className="facts visible" id="pet-facts">
                <div className="facts-split">
                  <img className="baby-image" src={hero} alt={petDetail.name} />
                  <div className="info-render">
                    <div><h4 className="montserrat-semi-bold">Common name:</h4><p className="montserrat-regular">{petDetail.commonName || '—'}</p></div>
                    <div><h4 className="montserrat-semi-bold">Scientific name:</h4><p className="montserrat-regular">{petDetail.scientificName || '—'}</p></div>
                    <div><h4 className="montserrat-semi-bold">Type:</h4><p className="montserrat-regular">{petDetail.type || '—'}</p></div>
                    <div><h4 className="montserrat-semi-bold">Diet:</h4><p className="montserrat-regular">{petDetail.diet || '—'}</p></div>
                    <div><h4 className="montserrat-semi-bold">Habitat:</h4><p className="montserrat-regular">{petDetail.habitat || '—'}</p></div>
                    <div><h4 className="montserrat-semi-bold">Range:</h4><p className="montserrat-regular">{petDetail.range || '—'}</p></div>
                  </div>
                </div>
                <Link to="/map" style={{ backgroundColor: 'white', color: '#F58021' }} className="montserrat-semi-bold view">
                  VIEW MAP
                  <img src="/assets/icons/arrow.png" alt="Go to destination" />
                </Link>
                <p className="montserrat-regular">{petDetail.description}</p>
              </section>
            </>
          )}

          {contentError && <p className="content-error visible">{contentError}</p>}
        </main>
      </div>

      <Footer onDonate={() => setDonationOpen(true)} />

      <DonationDialog
        isOpen={donationOpen}
        onClose={() => setDonationOpen(false)}
        pets={allPets}
        onNotification={(msg, success) => setNotification({ message: msg, success })}
      />

      {notification && (
        <div className={'donation-notification ' + (notification.success ? 'success' : 'error')}>
          {notification.message}
        </div>
      )}
    </>
  );
}