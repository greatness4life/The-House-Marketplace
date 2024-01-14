import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import KeyboardArrowIcon from "../assets/icons/KeyboardArrowIcon";
import { Link, useNavigate } from "react-router-dom";
const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const onChange = (e) => setEmail(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset sent successfull");
      navigate("/sign-in");
    } catch (error) {
      console.log(error.code, error.message);
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Reset Your Password</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="emailInput"
            placeholder="Your Email"
            id="email"
            value={email}
            onChange={onChange}
            required
            autoComplete="on"
          />
          <div className="signInBar">
            <p className="signInText">Reset Password</p>
            <button className="signInButton">
              <KeyboardArrowIcon fill="#fff" />
            </button>
          </div>
        </form>
        <Link to="/sign-in" className="registerLink">
          Sign In
        </Link>
      </main>
    </div>
  );
};
export default PasswordReset;
