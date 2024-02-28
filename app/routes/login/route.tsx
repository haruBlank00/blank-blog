import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
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
import { db } from "~/lib/prisma";
import { createServerClient, supabase } from "~/lib/supabase";
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

  const { headers, supabase } = createServerClient(request);
  // const blogs = await db.blog.findMany({});
  // console.log({ blogs });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log({ error });
    return json(
      { error: { message: error.message } },
      { headers, status: 401 }
    );
  }

  return redirect("/dashboard");

  /**
   * data: { user: null, session }
   * error: {
   *    __isAuthError: true,
   * name: "AuthApiError",
   * status: 500,
   * message: "Database error querying schema",
   * stact: "AuthApiError: Database error querying schema\n..."
   * }
   */

  /**
   * data: {
   *  user: {
      id: 'cd8865c5-e0c7-45e0-8b04-b127d4195adf',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'harublank00@gmail.com',
      email_confirmed_at: '2024-02-27T08:20:59.003299Z',
      phone: '',
      confirmation_sent_at: '2024-02-27T08:20:31.302548Z',
      confirmed_at: '2024-02-27T08:20:59.003299Z',
      last_sign_in_at: '2024-02-27T08:22:15.998386822Z',
      app_metadata: [Object],
      user_metadata: {},
      identities: [Array],
      created_at: '2024-02-27T08:20:31.294688Z',
      updated_at: '2024-02-27T08:22:16.000318Z'
   * },
      session: {
      access_token: '***',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: 1709025736,
      refresh_token: 'Z_9Ck4JzBwmyazaE7DZXRw',
      user: [Object]
    }
   * }
   * }
   */
};
