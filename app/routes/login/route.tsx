import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useForm } from "react-hook-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import FormBuilder, {
  TInputField,
} from "~/components/form-builder/form-builder";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { Form as ShadForm } from "~/components/ui/form";
import { toast } from "~/components/ui/use-toast";
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

export default function Login() {
  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const actionData = useActionData<typeof action>();

  if (actionData?.error) {
    toast({
      variant: "destructive",
      title: "Authentication error",
      description: actionData?.error?.message,
    });
  }

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
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  invariant(email, "Email is required");
  invariant(password, "Password is required");

  return redirect("/dashboard");
};
