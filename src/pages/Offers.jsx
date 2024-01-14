import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listingFetched, setListingFetched] = useState(null);

  // const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        //  Get reference
        const listingsRef = collection(db, "listings");

        // create qyuery
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        // Execute query

        const querySnap = await getDocs(q);
        const lastfetched = querySnap.docs[querySnap.docs.length - 1];
        setListingFetched(lastfetched);

        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("An occured from our end, try again");
      }
    };
    fetchListings();
  }, []);

  const fetchMoreListings = async () => {
    try {
      //  Get reference
      const listingsRef = collection(db, "listings");

      // create qyuery
      const q = query(
        listingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(listingFetched),
        limit(10)
      );

      // Execute query

      const querySnap = await getDocs(q);

      const lastfetched = querySnap.docs[querySnap.docs.length - 1];
      setListingFetched(lastfetched);
      const listings = [];

      querySnap.forEach((doc) => {
        // console.log(doc.data());
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prevState) => [...prevState, ...listings]);
      // console.log(listings);
      setLoading(false);
    } catch (error) {
      toast.error("An occured from our end, try again");
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>
      {loading ? (
        <h3>Loading...</h3>
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  key={listing.id}
                  id={listing.id}
                />
              ))}
            </ul>
          </main>
          <div>
            {listingFetched && listings.length > 10 && (
              <p className="loadMore" onClick={fetchMoreListings}>
                Load More
              </p>
            )}
          </div>
        </>
      ) : (
        <p>Currently, there are no offers</p>
      )}
    </div>
  );
};

export default Offers;
