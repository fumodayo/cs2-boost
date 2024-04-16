export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

export const formatJwt = () => {
  const token = localStorage.getItem("access_token");
  if (token) {
    const decodeJwt = parseJwt(token);
    return decodeJwt;
  }
  return null;
};
