import React from "react";
import { FaStar } from "react-icons/fa6";

interface IStarRatingProps {
  type?: string;
  rating?: number;
  setRating?: (value: number) => void;
}
const StarRating = React.memo(
  ({ type, rating = 0, setRating }: IStarRatingProps) => {
    const starRatings = [1, 2, 3, 4, 5];

    return (
      <div className="flex space-x-1">
        {starRatings.map((value, idx) =>
          type === "readonly" ? (
            <FaStar
              key={idx + 1}
              className={rating >= value ? "text-yellow-500" : ""}
            />
          ) : (
            <FaStar
              key={idx + 1}
              className={rating >= value ? "text-yellow-500" : ""}
              onClick={() => setRating?.(value)}
            />
          ),
        )}
      </div>
    );
  },
);

export default StarRating;