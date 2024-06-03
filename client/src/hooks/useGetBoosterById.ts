import { useEffect, useState } from "react";
import { User } from "../types";

export const useGetBoosterById = (id?: string) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/user/booster/${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await res.json();
      setUser(data);
    };
    fetchData();
  }, [id]);

  return user;
};
