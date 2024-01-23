import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import KeyboardArrowIcon from "../assets/icons/KeyboardArrowIcon";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import hiddenIcon from "../assets/svg/hidden.svg";
import OAuth from "../components/OAuth";
import Loading from "../components/Loading";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const auth = getAuth();
      const userDetails = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userDetails.user) {
        navigate("/");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Check Your Credentials");
    }
    setLoading(false);
  };
  return (
    <>
      {loading && <Loading />}
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <input
              type="email"
              className="emailInput"
              placeholder="Email"
              id="email"
              value={email}
              onChange={onChange}
              required
              autoComplete="off"
            />
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
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              )}
              {!showPassword && (
                <img
                  src={hiddenIcon}
                  alt="show Passwword"
                  className="showPassword"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              )}
              {showPassword && (
                <img
                  src={visibilityIcon}
                  alt="show Passwword"
                  className="showPassword"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              )}
            </div>
            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password?
            </Link>
            <div className="signInBar">
              <p className="signInText">Sign In</p>
              <button className="signInButton">
                <KeyboardArrowIcon fill="#fff" />
              </button>
            </div>
          </form>
          <OAuth />
          <Link to="/sign-up" className="registerLink">
            Sign Up
          </Link>
        </main>
      </div>
    </>
  );
};
export default SignIn;
