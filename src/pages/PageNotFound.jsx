import { Link } from "react-router-dom";
import homeIcon from "../assets/svg/houseIcon.svg";
const PageNotFound = () => {
  return (
    <div className="pagenotfound">
      <div className="notFound">
        <p className="pageHeader">Page Not Found</p>
        <div className="home">
          <p className="home--text">Go Back </p>
          <Link to="/">
            <img src={homeIcon} alt="" className="houseIcon" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default PageNotFound;
