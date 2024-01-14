import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import shareIcon from "../assets/svg/shareIcon.svg";
import addressIcon from "../assets/svg/addressIcon.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";

const Listing = () => {
  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const {
    name,
    type,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    userRef,
    offer,
    regularPrice,
    discountedPrice,
    imgUrls,
    geolocation,
    location,
  } = listing;

  // const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const getListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      // const snapShot =getDoc(doc(db, 'listing', params.listingId))
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    getListing();
  }, [params.listingId]);

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareLinkCopied(true);
    setTimeout(() => {
      setShareLinkCopied(false);
    }, 2000);
  };
  if (loading) {
    return <h1>Loading</h1>;
  }
  return (
    <main>
      {/* sliders */}
      <Swiper
        spaceBetween={30}
        effect={"fade"}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        modules={[EffectFade, Navigation, Pagination, Autoplay]}
        className="mySwiper"
      >
        {imgUrls.map((_, index) => (
          <SwiperSlide key={index}>
            <div
              className="swiperSlideDiv"
              style={{
                background: `url(${imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="shareIconDiv" onClick={shareLink}>
        <img src={shareIcon} alt="share" />
      </div>
      {shareLinkCopied && <p className="linkCopied"> Link copied</p>}
      <div className="listingDetails">
        <p className="listingName">
          {name} - $
          {offer
            ? discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="listingLocation categoryLocation">
          <img src={addressIcon} alt="location marker" />
          {location}
        </p>
        <p className="listingType">{type === "rent" ? "Rent" : "Sale"}</p>
        {offer && (
          <p className="discountPrice">
            ${regularPrice - discountedPrice} discount
          </p>
        )}
        <ul className="listingDetailsList">
          <li>{bedrooms > 1 ? `${bedrooms} Bedrooms` : "1 Bedroom"}</li>
          <li>{bathrooms > 1 ? `${bathrooms} Bathrooms` : "1 Bathroom"}</li>
          <li>{parking && "Parking Spot"}</li>
          <li>{furnished && "Furnished"}</li>
        </ul>
        <p className="listingLocationTitle">Location</p>
        <div className="leafletContainer">
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            center={[geolocation.lat, geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[geolocation.lat, geolocation.lng]}>
              <Popup>{location}</Popup>
            </Marker>
          </MapContainer>
        </div>
        {auth.currentUser?.uid !== userRef && (
          <Link
            to={`/contact/${userRef}?listingName=${name}`}
            className="primaryButton"
          >
            contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
};
export default Listing;
