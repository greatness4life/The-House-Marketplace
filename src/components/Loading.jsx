import LoadingSignIn from "../assets/svg/LoadingIcon.svg";
const Loading = () => {
  return (
    <div className="overlay">
      <div className="container">
        <img src={LoadingSignIn} alt="Loading" />
      </div>
    </div>
  );
};
export default Loading;
