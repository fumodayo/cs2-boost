import Marquee from "react-fast-marquee";
import { useTranslation } from "react-i18next";
import { FaLocationCrosshairs, FaStar } from "react-icons/fa6";
import cn from "~/libs/utils";
import { v4 as uuidv4 } from "uuid";

interface IBadgeProps {
  image: string;
  username: string;
  country: string;
  content: string;
}

const badgeCols1: IBadgeProps[] = [
  {
    image: "/assets/user/1.png",
    username: "fumodayo",
    country: "Vietnam",
    content:
      "Dịch vụ boosting của CS2Boost thật tuyệt vời! Tôi đã tăng hạng rất nhanh chóng và quá trình này diễn ra vô cùng mượt mà. Đội ngũ hỗ trợ rất chuyên nghiệp và thân thiện. Tôi rất hài lòng với kết quả và chắc chắn sẽ quay lại sử dụng dịch vụ này trong tương lai.",
  },
  {
    image: "/assets/user/2.png",
    username: "noobplayer",
    country: "United States",
    content:
      "I tried many websites but cs2boost is definitely the best for me, awesome customer support, dashboard is perfect, every Booster that I had did amazing, I love this website",
  },
  {
    image: "/assets/user/3.png",
    username: "virtual",
    country: "Germany",
    content:
      "I've been in gold for months and my Booster just won 12 games in a row with 9 KDA playing nidalee jungle, I didn't know it's possible, boosters here are built differently + the staff is so kind, they answered to everything instantly",
  },
  {
    image: "/assets/user/4.png",
    username: "CirnoGaming",
    country: "Australia",
    content:
      "I was initially skeptical about Boosting but I have decided to give it and try and I'm so glad that I did, the Booster took me from silver to platinum IN TWO DAYS with over 90% win ratio, insane",
  },
  {
    image: "/assets/user/5.png",
    username: "OWN",
    country: "Canada",
    content:
      "Played DUO with the booster, easiest grind of my life, from being stuck silver for 2 seasons I got Diamond in one week, 100% recommend",
  },
];

const badgeCols2: IBadgeProps[] = [
  {
    image: "/assets/user/6.png",
    username: "Paulions",
    country: "Portugal",
    content:
      "Literally 11/10! I ordered a boost from Platinum to Master and they finished it in 8 days!! The Booster did over 85% win ratio on all of the games, thank you!",
  },
  {
    image: "/assets/user/7.png",
    username: "k4icsgo",
    country: "Netherlands",
    content:
      "Every time that I buy Boost here the boosters do a fantastic job, if you truly require a service like this then I can definitely recommend cs2boost",
  },
  {
    image: "/assets/user/8.png",
    username: "kiddor",
    country: "Germany",
    content:
      "It's a really good service, boost completed in less than 24 hours, instant feedback and super helpful",
  },
  {
    image: "/assets/user/9.png",
    username: "Lokkia",
    country: "Australia",
    content:
      "I put wrong information on my Boost and support was so nice to help and change things for free. Great staff and great boosting services!",
  },
  {
    image: "/assets/user/10.png",
    username: "KaiT",
    country: "Canada",
    content:
      "Very fun experience, tried couple boosters and each of them were talkative and gave me good tips while winning the games for me",
  },
];

const Card = ({ image, username, country, content }: IBadgeProps) => (
  <div
    className={cn(
      "z-20 my-3 mr-6 flex w-full max-w-md flex-col self-stretch rounded-2xl border border-border bg-card p-6 shadow-md",
      "dark:bg-[#141825]/70",
    )}
  >
    <div className="flex w-full gap-4">
      <img
        className="h-12 w-12 shrink-0 rounded-full"
        src={image}
        alt="avatar"
        loading="lazy"
      />
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <p className="secondary text-base font-semibold tracking-tighter text-foreground">
            {username}
          </p>
          <FaStar className="ml-auto text-success-light-foreground" />
        </div>
        <div className="flex items-baseline gap-1">
          <FaLocationCrosshairs className="text-xs text-muted-foreground" />
          <p className="secondary text-xs text-muted-foreground">{country}</p>
        </div>
      </div>
    </div>
    <p className="secondary my-4 text-base font-medium tracking-tight text-muted-foreground">
      {content}
    </p>
  </div>
);

const MarqueeComment = () => {
  const { t } = useTranslation();

  return (
    <div className="relative z-10 mx-auto mt-32 grid w-full grid-cols-1 justify-center gap-5 overflow-clip">
      <div className="flex w-full items-center justify-center">
        <img
          className={cn("absolute -top-20 hidden", "dark:block")}
          src="/assets/backgrounds/trust-min.png"
          alt="green gradient"
          loading="lazy"
        />
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 xl:px-8">
        {/* TRUSTPILOT BADGE */}
        <div className={cn("flex flex-col gap-6", "md:flex-row md:gap-0")}>
          <h4
            className={cn(
              "font-display mx-auto max-w-sm text-center text-4xl font-bold text-foreground",
              "md:mx-0 md:text-start",
            )}
          >
            {t("MarqueeComment.heading")}
          </h4>

          <div className="md:ml-auto">
            <div className="trustpilot-badge-bg flex flex-row gap-8 rounded-xl border border-border bg-card px-6 py-5">
              <div className="ml-auto flex select-none flex-col">
                <h5 className="flex gap-1 text-sm font-bold text-foreground">
                  {t("Globals.TrustpilotBadge.Excellent")}
                  <span className="text-[#00B67A]">4.6</span>
                  {t("Globals.TrustpilotBadge.out of")} 5.0
                </h5>
                <p className="secondary mt-1 text-xs text-muted-foreground">
                  {t("Globals.TrustpilotBadge.Based on 9,510 reviews")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MARQUEE */}
        <div
          className={cn(
            "mt-20 flex w-full flex-col rounded-xl py-6 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]",
            "dark:border-[#00B67B]/5",
          )}
        >
          <Marquee pauseOnHover>
            <div className="flex flex-row">
              {badgeCols1.map((props) => (
                <Card key={uuidv4()} {...props} />
              ))}
            </div>
          </Marquee>
          <Marquee pauseOnHover>
            <div className="flex flex-row">
              {badgeCols2.map((props) => (
                <Card key={uuidv4()} {...props} />
              ))}
            </div>
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default MarqueeComment;
