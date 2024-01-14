import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import ListingItem from "../components/ListingItem";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import homeIcon from "../assets/svg/homeIcon.svg";
import settingIcon from "../assets/svg/settingIcon.svg";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import { upload } from "../hooks/useAuthStatus";

const Profile = () => {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
    img: auth.currentUser.photoURL,
  });
  const { name, email, img } = formData;

  const navigate = useNavigate();

  // Fetch User Listing
  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      const listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

  // SignOUt User
  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  // Edit User Profile
  const onChange = (e) => {
    if (e.target.files[0]) {
      setFormData((prevState) => ({
        ...prevState,
        img: e.target.files[0],
      }));
    }
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async () => {
    upload(img);
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: img,
        });

        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(auth.currentUser);
  const onDelete = async (listingId) => {
    if (window.confirm("Are sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingId));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success("item deleted successfully");
    }
  };
  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="personalDetailsText">Personal Details</p>
          {img === null && (
            <p
              className="changePersonalDetails"
              onClick={() => {
                changeDetails && onSubmit();
                setChangeDetails((prev) => !prev);
              }}
            >
              {changeDetails ? "Done" : "Edit Profile"}
            </p>
          )}
        </div>
        <div className="profileCard">
          {img === null ? (
            <>
              <div className="profileAvatar">
                {changeDetails && (
                  <>
                    <label htmlFor="avatar" className="avatarLabel">
                      Upload..
                    </label>
                    <input
                      type="file"
                      id="avatar"
                      onChange={onChange}
                      max="1"
                      accept=".jpg,.png,.jpeg"
                      disabled={!changeDetails}
                    />
                  </>
                )}

                <img
                  src={
                    img ??
                    "data:image/jpeg;base64,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"
                  }
                  className="profileImage"
                  id=""
                />
              </div>
            </>
          ) : (
            <div>
              <img src={img} alt="Profile Image" className="profileImage" />
            </div>
          )}

          <div>
            <form>
              <input
                type="text"
                id="name"
                className={!changeDetails ? "profileName" : "profileNameActive"}
                disabled={!changeDetails}
                value={name}
                onChange={onChange}
                autoComplete="off"
              />
            </form>
            <p className="profileEmail">{email}</p>
          </div>
        </div>
        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or Rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>
        <Link to="/setting" className="createListing">
          <img src={settingIcon} alt="setting" />
          <p>Setting</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>
        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText"> Your Listings</p>
            <ul className="no-padding">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id, name)}
                  onEdit={() => onEdit(listing.id, name)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};
export default Profile;
