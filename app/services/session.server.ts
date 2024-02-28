import { User } from "@prisma/client";
import { createCookieSessionStorage } from "@remix-run/node";

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ["s3cr3t"], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

export const getSession = (request: Request) => {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
};

export const getUser = async (request: Request) => {
  const cookie = request.headers.get("Cookie");
  const session = await sessionStorage.getSession(cookie);
  const user: User = session.data.user;
  return user;
};
// export let { getSession, commitSession, destroySession } = sessionStorage;
