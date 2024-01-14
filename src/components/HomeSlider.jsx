import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HomeSlider = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);

      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);

      setLoading(false);
    };
    fetchListings();
  }, []);

  if (loading) {
    return <h1>Loading....</h1>;
  }
  if (listings.length === 0) {
    return <></>;
  }
  return (
    listings && (
      <>
        <p className="exploreHeading">Recommended</p>
        <Swiper
          slidesPerView={1}
          effect={"fade"}
          navigation={true}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="swiperSlideDiv"
              >
                <div className="sliderText">
                  <p className="swiperSlideText">{data.name}</p>

                  <p className="swiperSlidePrice">
                    <span className="priceText">Price</span> $
                    {data.discountedPrice ?? data.regularPrice}
                    {data.type === "rent" && (
                      <span className="perMonth"> / month</span>
                    )}
                  </p>
                  <p className="swiperSlideType">For {data.type}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
};
export default HomeSlider;
