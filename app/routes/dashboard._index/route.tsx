import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createServerClient } from "~/lib/supabase";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { supabase } = createServerClient(request);
  const session = await supabase.auth.getSession();
  if (!session.data.session) {
    return redirect("/login");
  }
  return null;
};

export default function Dashboard() {
  return <h2>helo world</h2>;
}
