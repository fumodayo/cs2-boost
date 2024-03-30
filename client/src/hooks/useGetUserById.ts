import { useEffect, useState } from "react";
import { User } from "../types";

export const useGetUserById = (id?: string) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/user/get/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setUser(data);
    };
    fetchData();
  }, [id]);

  return user;
};
