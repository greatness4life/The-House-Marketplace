import { useNavigate, useLocation } from "react-router-dom";
import ExploreIcon from "../assets/icons/ExploreIcon";
import OfferIcon from "../assets/icons/OfferIcon";
import ProfileIcon from "../assets/icons/ProfileIcon";
// import OfferIcon from "../assets/svg/localOfferIcon.svg";
// import ExploreIcon from "../assets/svg/exploreIcon.svg";
// import PersonOutlineIcon from "../assets/svg/personOutlineIcon.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatch = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          <li className="navbarListItem" onClick={() => navigate("/")}>
            <ExploreIcon fill={pathMatch("/") ? "#2c2c2c" : "#8f8f8f"} />
            <p
              className={
                pathMatch("/")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Explore
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/offers")}>
            <OfferIcon fill={pathMatch("/offers") ? "#2c2c2c" : "#8f8f8f"} />
            <p
              className={
                pathMatch("/offers")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Offers
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/profile")}>
            <ProfileIcon fill={pathMatch("/profile") ? "#2c2c2c" : "#8f8f8f"} />
            <p
              className={
                pathMatch("/profile")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  );
};
export default Navbar;
