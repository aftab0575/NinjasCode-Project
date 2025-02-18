import GoogleMapComponent from "./components/GoogleMap/page";
import Navbar from "./components/navbar/page";
// import NearbyRestaurants from "./components/NearbyResturants/page";
import SearchPlaces from "./components/SearchPlaces/page";
import UserLocationButton from "./components/userLocation/page";
import "./globals.css";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <SearchPlaces/>
      <GoogleMapComponent/>
      <UserLocationButton/>
      {/* <NearbyRestaurants/> */}
    </div>
  );
}



