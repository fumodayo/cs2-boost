import { Link } from "react-router-dom";

const Inbox = () => {
  return (
    <Link to={"/"}>
      <div className="space-y-2 rounded-md border-b-2 border-border bg-card p-6 shadow hover:opacity-80">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <div className="relative block h-10 w-10 shrink-0 rounded-full text-sm">
              <img
                className="h-full w-full rounded-full object-cover"
                src="https://res.cloudinary.com/du93troxt/image/upload/v1714744499/avatar_qyersf.jpg"
                alt="avatar"
              />
              <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-card" />
            </div>
            <div>
              <p className="text-sm">Marting Markgatt</p>
              <span className="text-xs">Partner</span>
            </div>
          </div>
          <span className="bottom-0 right-0 block h-3 w-3 rounded-full bg-primary-light-foreground ring-2 ring-card" />
        </div>
        <div className="flex space-x-4">
          <p className="truncate text-sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book
          </p>
          <div className="text-sm">5m</div>
        </div>
      </div>
    </Link>
  );
};

export default Inbox;
