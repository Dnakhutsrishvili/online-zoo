import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import LandingPage from './pages/landing/LandingPage';
import RegistrationPage from './pages/registration/RegistrationPage'
import AnimalPage from './pages/animal/AnimalPage';
import ContactPage from './pages/contact/ContactPage';
import MapPage from './pages/map/MapPage';
import { DonationProvider } from './context/DonationContext';

export default function App() {
  return (
    <UserProvider>
      <DonationProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/animal" element={<AnimalPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </DonationProvider>
    </UserProvider>
  );
}
