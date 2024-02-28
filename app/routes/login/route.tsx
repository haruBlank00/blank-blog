import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormBuilder, {
  TInputField,
} from "~/components/form-builder/form-builder";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { Form as ShadForm } from "~/components/ui/form";
import { authenticator } from "~/services/auth.server";
const loginSchema = z.object({
  email: z.string().min(1, {
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

const loginFields: TInputField[] = [
  {
    label: "Email",
    name: "email",
    placeholder: "johndoe@gmail.com",
    required: true,
  },
  {
    label: "Password",
    name: "password",
    placeholder: "********",
    required: true,
    type: "password",
  },
];

type TLoginSchema = z.infer<typeof loginSchema>;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
};

export default function Login() {
  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="h-screen w-screen grid place-items-center">
      <Card className="w-80 p-4">
        <CardTitle className="mb-4">Login</CardTitle>

        <CardDescription className="mb-8">
          Enter your email and password to login to your account
        </CardDescription>

        <ShadForm {...form}>
          <Form method="post">
            <FormBuilder fields={loginFields} form={form} />

            <Button className="w-full" type="submit">
              Login
            </Button>
          </Form>
        </ShadForm>
      </Card>
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticator.authenticate("user-pass", request, {
    throwOnError: true,
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
  return json({ status: 401, message: "couln't login" });
};
