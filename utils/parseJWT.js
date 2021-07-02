import CryptoJS from "crypto-js";

export const parseJWT = (token) => {
  const base64URL = token.split(".")[1];
  const base64 = base64URL.replace("-", ".").replace("-", "/");
  if (typeof atob === "function") {
    return JSON.parse(window.atob(base64));
  } else if (typeof Buffer === "function") {
    let token = CryptoJS.enc.Base64.parse(base64);
    return JSON.parse(CryptoJS.enc.Utf8.stringify(token));
  } else {
    throw new Error("Failed to determine the platform specific decoder");
  }
};
