import axios from "axios";
import Router from "next/router";
import Cookies from "js-cookie";
import nextCookies from "next-cookies";

export const HandleAuthSSR = async (ctx) => {
  const { token } = nextCookies(ctx);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/list`;

  const redirectOnError = () => {
    console.log("redirect into login page");
    if (typeof window !== "undefined") {
      Router.push("/auth/login");
    } else {
      ctx.res.writeHead(302, { Location: "/auth/login" });
      ctx.res.end();
    }
  };
  try {
    if (!token) {
      return redirectOnError();
    }
    const response = await axios.get(url, {
      headers: { Authorization: token },
    });
    console.log(response.data);
    if (!response.data.user) {
      return redirectOnError();
    }
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
};
