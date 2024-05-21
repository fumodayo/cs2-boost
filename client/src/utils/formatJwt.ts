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
    console.log(decodeJwt);
    return decodeJwt;
  }
  return null;
};
