import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-toastify";

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true);
        }
        setCheckingStatus(false);
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  return { loggedIn, checkingStatus };
};

export const upload = async (img) => {
  if (!img) {
    return;
  }
  const auth = getAuth();
  const storage = getStorage();
  // Creat unique file path
  const fileName = `${auth.currentUser.uid}-${img?.name}`;
  const storageRef = ref(storage, "profileImages/" + fileName);

  await uploadBytesResumable(storageRef, img);
  // Get Download URL
  const photoURL = await getDownloadURL(storageRef);
  updateProfile(auth.currentUser, {
    photoURL,
  });
  toast.success("photo Uploaded!");
};
