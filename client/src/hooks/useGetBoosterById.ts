import { useEffect, useState } from "react";
import { User } from "../types";
import { axiosAuth } from "../axiosAuth";

export const useGetBoosterById = (id?: string) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axiosAuth.get(`/user/booster/${id}`);
      setUser(data);
    };
    fetchData();
  }, [id]);

  return user;
};
