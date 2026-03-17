import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

function MapPage() {
  return (
    <div>
        <Navbar/>
         <main>
        <div className="map-container">
            <h2 className="montserrat-regular">find where are the animals live</h2>
            <img src="/assets/map/map.png" alt="Zoo Map" className="map-image" />
            <div className="map-overlay">
<img src="/assets/map/icons/animal-icon-1.png" alt="icon" className="map-icon" />  
<img src="/assets/map/icons/animal-icon-2.png" alt="icon" className="map-icon" />
<img src="/assets/map/icons/animal-icon-3.png" alt="icon" className="map-icon" />    
<img src="/assets/map/icons/animal-icon-4.png" alt="icon" className="map-icon" />
<img src="/assets/map/icons/animal-icon-5.png" alt="icon" className="map-icon" />  
<img src="/assets/map/icons/animal-icon-6.png" alt="icon" className="map-icon" />  
<img src="/assets/map/icons/animal-icon-7.png" alt="icon" className="map-icon" />  
<img src="/assets/map/icons/animal-icon-8.png" alt="icon" className="map-icon" />  
            </div>
        </div>
    </main>
    <Footer/>
    </div>
  )
}

export default MapPage