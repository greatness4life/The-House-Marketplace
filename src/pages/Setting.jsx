import { useState, useEffect, useRef } from "react";
import { db } from "../firebase.config";
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import "react-phone-number-input/style.css";
import { toast } from "react-toastify";

import KeyboardArrowIcon from "../assets/icons/KeyboardArrowIcon";
import { useNavigate } from "react-router-dom";

const Setting = () => {
  const auth = getAuth();

  const [editUserDetails, setEditUserDetails] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    address: "",
    country: "",
    tel: "",
  });
  const [loading, setLoading] = useState(true);

  const { name, state, address, country, tel } = formData;

  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoading(true);
          onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
            const userData = doc.data();
            setFormData(userData);
            setLoading(false);
          });
        } else {
          navigate("/sign-in");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  // console.log("show form data", formData);

  const onChange = (e) => {
    if (e.target.id === "tel") {
      const phonePattern = /^\d{10}$/; // Basic pattern for 10-digit phone numbers
      if (!phonePattern.test(tel)) {
        setIsValid(false);
      } else {
        setIsValid(true);
        console.log("valid number");
      }
    }

    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
          state,
          address,
          country,
          tel,
        });
        toast.success("Your profile was updated");
        navigate("/profile");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading) {
    return <h1>Loading setting...</h1>;
  }

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Your Bio Data</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="nameInput"
            placeholder="Full Name"
            name="name"
            id="name"
            value={name}
            onChange={onChange}
            required
            autoComplete="off"
          />

          <input
            type="text"
            className="addressInput"
            placeholder="Address"
            id="address"
            value={address}
            onChange={onChange}
            autoComplete="off"
          />
          <input
            type="text"
            className="addressInput"
            placeholder="Country"
            id="country"
            value={country}
            onChange={onChange}
            autoComplete="off"
          />
          <input
            type="text"
            className="addressInput"
            placeholder="State"
            id="state"
            value={state}
            onChange={onChange}
            autoComplete="off"
          />
          <input
            className="profilePhone"
            placeholder="Phone Number"
            id="tel"
            value={tel}
            onChange={onChange}
            required
            autoComplete="off"
          />
          {!isValid && <p> Enter Correct Phone number</p>}
          <div className="signInBar">
            <p className="signInText">Update Profile</p>
            <button className="signInButton">
              <KeyboardArrowIcon fill="#fff" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
export default Setting;
