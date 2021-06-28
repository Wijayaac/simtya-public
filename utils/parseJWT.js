export const parseJWT = (token) => {
  const base64URL = token.split(".")[1];
  const base64 = base64URL.replace("-", ".").replace("-", "/");
  return JSON.parse(window.atob(base64));
};
