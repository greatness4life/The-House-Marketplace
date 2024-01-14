import { useState } from "react";
import { toast } from "react-toastify";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { Link, useNavigate } from "react-router-dom";
import KeyboardArrowIcon from "../assets/icons/KeyboardArrowIcon";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import hiddenIcon from "../assets/svg/hidden.svg";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const passwordMismatch =
    password !== confirmPassword ? "Password mismatch" : "";

  const showPasswordText = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (passwordMismatch) {
      return;
    }
    try {
      const auth = getAuth();
      const userDetails = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userDetails.user;
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      // Create A copy of Data

      const formDataCopy = { ...formData };

      // using Delete keyword
      delete formDataCopy.password;
      delete formDataCopy.confirmPassword;

      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already exist");
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  // For Password MisMatch

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              className="nameInput"
              placeholder="Full Name"
              id="name"
              value={name}
              onChange={onChange}
              required
              autoComplete="on"
            />
            <input
              type="email"
              className="emailInput"
              placeholder="Email"
              id="email"
              value={email}
              onChange={onChange}
              required
              autoComplete="on"
            />
            {/* <input
              type="text"
              className="nameInput"
              placeholder="Country"
              id="country"
              value={country}
              onChange={onChange}
              autoComplete="on"
            />
            <input
              type="text"
              className="nameInput"
              placeholder="Address"
              id="address"
              value={address}
              onChange={onChange}
              autoComplete="on"
            />
            <input
              type="tel"
              className="nameInput"
              placeholder="Phone Number"
              id="tel"
              value={tel}
              onChange={onChange}
              required
              autoComplete="on"
              pattern="[0-9]{10}"
            /> */}

            <div className="passwordInputDiv">
              <input
                type={showPassword ? "text" : "password"}
                className="passwordInput"
                placeholder="password"
                id="password"
                value={password}
                onChange={onChange}
                required
              />
              {showPassword && (
                <img
                  src={visibilityIcon}
                  alt="show Passwword"
                  className="showPassword"
                  onClick={showPasswordText}
                />
              )}
              {!showPassword && (
                <img
                  src={hiddenIcon}
                  alt="show Passwword"
                  className="showPassword"
                  onClick={showPasswordText}
                />
              )}
            </div>
            <div className="passwordInputDiv">
              <input
                type={showPassword ? "text" : "password"}
                className="passwordInput"
                placeholder="confirm password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                required
              />
              {showPassword && (
                <img
                  src={visibilityIcon}
                  alt="confirm Passwword"
                  className="showPassword"
                  onClick={showPasswordText}
                />
              )}
              {!showPassword && (
                <img
                  src={hiddenIcon}
                  alt="confirm Passwword"
                  className="showPassword"
                  onClick={showPasswordText}
                />
              )}
            </div>
            <p className="passwordMismatch">{passwordMismatch}</p>
            {/* <div className="profileAvatar">
              <label htmlFor="avatar" className="avatar">
                Uplaod Profile Picture
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg"
                className="avatar-img"
                onChange={imgUpload}
              />
            </div> */}
            {/* <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password?
            </Link> */}
            <div className="signInBar">
              <p className="signInText">Sign Up</p>
              <button disabled={passwordMismatch} className="signInButton">
                <KeyboardArrowIcon fill="#fff" />
              </button>
            </div>
          </form>
          <OAuth />
          <Link to="/sign-in" className="registerLink">
            Sign In
          </Link>
        </main>
      </div>
    </>
  );
};
export default SignUp;