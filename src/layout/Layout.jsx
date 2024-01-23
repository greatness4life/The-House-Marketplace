import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignIn from "../pages/SignIn";
import HomeListing from "../pages/HomeListing";
import SignUp from "../pages/SignUp";
import Profile from "../pages/Profile";
import PasswordReset from "../pages/PasswordReset";
import Offers from "../pages/Offers";
import Navbar from "../components/Navbar";
import PrivateRoute from "../components/PrivateRoute";
import Category from "../pages/Category";
import CreateListing from "../pages/CreateListing";
import Setting from "../pages/Setting";
import Listing from "../pages/Listing";
import Contact from "../pages/Contact";
import EditListing from "../pages/EditListing";
import PageNotFound from "../pages/PageNotFound";

const Layout = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomeListing />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/setting" element={<Setting />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<PasswordReset />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/edit-listing/:listingId" element={<EditListing />} />
          <Route
            path="/category/:categoryName/:listingId"
            element={<Listing />}
          />
          <Route path="/contact/:landlordId" element={<Contact />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
};
export default Layout;
