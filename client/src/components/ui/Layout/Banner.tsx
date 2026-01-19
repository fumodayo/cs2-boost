interface IBannerProps {
  image: string;
}

const Banner = ({ image }: IBannerProps) => (
  <div className="absolute -z-10 w-full">
    <div className="relative h-[60vh] overflow-hidden">
      <img
        className="h-full w-full object-cover saturate-0 dark:hidden"
        src={`/assets/games/${image}/banner.png`}
        alt="Banner"
      />
      <img
        className="hidden h-full w-full object-cover dark:block"
        src={`/assets/games/${image}/banner.png`}
        alt="Banner"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-background/90 backdrop-blur-sm" />
    </div>
  </div>
);

export default Banner;