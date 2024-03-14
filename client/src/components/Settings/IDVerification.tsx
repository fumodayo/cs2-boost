import { FaPlay } from "react-icons/fa6";
import Widget from "../Widget";

const userInfo = {
  full_name: "_",
  country: "_",
  city: "_",
  postal_code: "_",
  address: "_",
  phone_number: "_",
  national_id: "_",
  gender: "_",
  date_of_birth: "_",
};

const headers = [
  "full name",
  "country",
  "city",
  "postal code",
  "address",
  "phone",
  "national ID",
  "gender",
  "birth date",
];

const IDVerification = () => {
  return (
    <div className="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-x-5 gap-y-5 lg:mx-0 lg:grid-cols-3">
      {/* VERIFY */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-1 lg:col-start-3 lg:row-end-1 lg:grid-cols-1">
        <div className="rank-gradient grad-league-of-legends-silver -mx-4 border bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
          <div className="flex w-full items-center px-4 py-6 sm:px-6">
            <img
              src="https://cdn.gameboost.com/static/features/verified-icon.webp"
              className="mr-2 opacity-30"
            />
            <div className="flex flex-col items-baseline gap-x-1">
              <span className="text-2xl font-semibold leading-10 tracking-tight text-foreground">
                Not Verified
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                Complete the verification process to become a verified user
              </span>
            </div>
          </div>
          <div className="flex items-center border-t border-border bg-muted/50 px-4 py-3 sm:rounded-b-xl sm:px-6">
            <button className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent px-2 py-1.5 text-xs font-medium text-primary-light-foreground outline-none transition-colors hover:bg-primary-light focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
              <FaPlay className="mr-2" />
              Start Verification
            </button>
          </div>
        </div>
      </div>

      {/* INFORMATION */}
      <div className="space-y-4 lg:col-span-2 lg:row-span-2 lg:row-end-2 lg:space-y-6">
        <Widget
          titleHeader="Personal Info"
          headers={headers}
          boostItem={userInfo}
        />
      </div>
    </div>
  );
};

export default IDVerification;
