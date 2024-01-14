import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import DeleteIcon from "../assets/icons/DeleteIcon";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";
import addressIcon from "../assets/svg/addressIcon.svg";
import EditIcon from "../assets/icons/EditIcon";

const ListingItem = ({ listing, onDelete, id, onEdit }) => {
  const {
    imgUrls,
    name,
    location,
    offer,
    discountedPrice,
    regularPrice,
    type,
    bedrooms,
    bathrooms,
  } = listing;
  return (
    <li className="categoryListing">
      <Link to={`/category/${type}/${id}`} className="categoryListingLink">
        <img src={imgUrls[0]} alt={name} className="categoryListingImg" />
        <div className="categoryListingDetails">
          <p className="categoryListingLocation categoryLocation">
            <img src={addressIcon} alt="location marker" />
            {location}
          </p>
          <p className="categoryListingName">{name}</p>
          <p className="categoryListingPrice">
            $
            {offer
              ? discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {type === "rent" && "/ Month"}
          </p>
          <div className="categoryListingInfoDiv">
            <img src={bedIcon} alt="bed" />
            <p className="categoryListingInfoText">
              {bedrooms > 1 ? `${bedrooms} Bedrooms` : "1 Bedroom"}
            </p>
            <img src={bathtubIcon} alt="bath" />
            <p className="categoryListingInfoText">
              {bathrooms > 1 ? `${bathrooms} Bathrooms` : "1 Bathroom"}
            </p>
          </div>
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="rgb(231,76, 60)"
          onClick={() => onDelete(id, name)}
        />
      )}
      {onEdit && <EditIcon className="editIcon" onClick={() => onEdit(id)} />}
    </li>
  );
};
ListingItem.propTypes = {
  listing: PropTypes.object,
  id: PropTypes.string,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

export default ListingItem;
