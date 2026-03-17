import { useState, useEffect } from 'react'
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import styles from './map.module.css'
import { ANIMAL_ICONS } from '../../constants/paths'
import { IconPosition } from '../../models/animal'


function MapPage() {
  const [positions, setPositions] = useState<IconPosition[]>([])

  useEffect(() => {
    const randomPositions = ANIMAL_ICONS.map(() => ({
      top: Math.random() * 75 + 10, 
      left: Math.random() * 85 + 5,
    }))
    setPositions(randomPositions)
  }, [])

  return (
    <div>
      <Navbar />
      <main>
        <div className={styles.map_container}>
          <h2 className={`montserrat-regular ${styles.map_title}`}>
            Find where the animals live
          </h2>
          <div className={styles.map_wrapper}>
            <img 
              src="/assets/map/map.png" 
              alt="Zoo Map" 
              className={styles.map_image} 
            />
            <div className={styles.map_overlay}>
              {ANIMAL_ICONS.map((icon, index) => (
                <img 
                  key={index}
                  src={icon} 
                  alt={`Animal location ${index + 1}`} 
                  className={styles.map_icon}
                  style={{
                    top: `${positions[index]?.top || 0}%`,
                    left: `${positions[index]?.left || 0}%`,
                    transform: 'translate(-50%, -50%)', 
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default MapPage