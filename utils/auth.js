import axios from "axios";
import Router from "next/router";
import Cookies from "js-cookie";
import nextCookies from "next-cookies";
import { parseJWT } from "./parseJWT";

export const HandleAuthSSR = async (ctx) => {
  const { token } = nextCookies(ctx);

  const { role } = parseJWT(token);

  const redirectOnError = () => {
    console.log("redirect into login page");
    if (typeof window !== "undefined") {
      Router.push("/auth/login");
    } else {
      ctx.res.writeHead(302, { Location: "/auth/login" });
      ctx.res.end();
    }
  };
  const redirectOnRole = (role) => {
    console.log("redirect into login page");
    if (typeof window !== "undefined") {
      Router.back();
    } else {
      ctx.res.writeHead(302, { Location: `/${role}/` });
      ctx.res.end();
    }
  };

  try {
    if (!token) {
      return redirectOnError();
    }
    console.log(role);
    switch (role) {
      case 1:
        break;
      case 2:
        redirectOnRole("driver");
        break;
      case 3:
        redirectOnRole("member");
        break;

      default:
        break;
    }
    return token;
  } catch (error) {
    console.log("Error when try authorizing users", error);
    return redirectOnError();
  }
  return {};
};

export const login = async ({ token }) => {
  // Cookie wil expire after 24h
  Cookies.set("token", token, { expires: 1 });
};
export const logout = () => {
  Cookies.remove("token");
  Router.push("/auth/login");
};
