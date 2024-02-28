import { Authenticator, Strategy } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { FormStrategy } from "remix-auth-form";
import { User } from "@prisma/client";
import { db } from "~/lib/prisma";
import invariant from "tiny-invariant";

export let authenticator = new Authenticator<User>(sessionStorage);

const formStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get("email")?.toString() as string;
  const password = form.get("password")?.toString() as string;
  invariant(email, "Emais is required");
  invariant(password, "Password is required");
  const user = await login(email, password);
  return user;
});

authenticator.use(formStrategy, "user-pass");

const login = async (email: string, password: string) => {
  console.log({ email, password });
  const user = await db.user.findFirst({
    where: {
      email,
      password,
    },
  });
  invariant(user, "User not found");
  return user;
};
