import {
 createContext, useContext, useState, ReactNode
} from 'react';
import DonationDialog from '../components/DonationDialog';

interface Pet {
  id: string;
  name: string;
}

interface DonationContextType {
  isOpen: boolean;
  openDonation: () => void;
  closeDonation: () => void;
  showNotification: (message: string, success: boolean) => void;
}

interface Notification {
  message: string;
  success: boolean;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

const PETS: Pet[] = [
  { id: '1', name: 'Leo the Lion' },
  { id: '2', name: 'Ella the Elephant' },
  { id: '3', name: 'Gigi the Giraffe' },
  { id: '4', name: 'Zara the Zebra' },
];

export const DonationProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const openDonation = () => setIsOpen(true);
  const closeDonation = () => setIsOpen(false);

  const showNotification = (message: string, success: boolean) => {
    setNotification({ message, success });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <DonationContext.Provider
      value={{
        isOpen,
        openDonation,
        closeDonation,
        showNotification,
      }}
    >
      {children}

      <DonationDialog
        isOpen={isOpen}
        onClose={closeDonation}
        pets={PETS}
        onNotification={showNotification}
      />

      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            backgroundColor: notification.success ? 'var(--pale-green-solid)' : 'var(--error)',
            color: 'white',
            borderRadius: '4px',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            animation: 'slideInRight 0.3s ease-out',
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '0.95rem',
            fontWeight: 600,
          }}
        >
          {notification.message}
        </div>
      )}

      <style>
        {`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}
      </style>
    </DonationContext.Provider>
  );
}

export function useDonation() {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error('useDonation must be used within DonationProvider');
  }
  return context;
}
