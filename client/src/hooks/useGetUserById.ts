import { useEffect, useState } from "react";
import { User } from "../types";
import { axiosAuth } from "../axiosAuth";

export const useGetUserById = (id?: string) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axiosAuth.get(`/user/get/${id}`);
      setUser(data);
    };
    fetchData();
  }, [id]);

  return user;
};
