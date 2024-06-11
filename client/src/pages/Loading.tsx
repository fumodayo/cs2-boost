import { BounceLoader } from "react-spinners";

const Loading = () => {
  return (
    <>
      <div className="flex h-screen items-center justify-center bg-background">
        <BounceLoader color="#0b6cfb" />
      </div>
    </>
  );
};

export default Loading;
