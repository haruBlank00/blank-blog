import type { MetaFunction } from "@remix-run/node";
import { NavLink } from "@remix-run/react";
export const meta: MetaFunction = () => {
  return [
    { title: "Blank Blog" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      <header>
        <div>Blank Blog</div>

        <nav>
          <ul>
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={"/blogs"}>Blogs</NavLink>
          </ul>
        </nav>
      </header>

      <main>home page comming soon...</main>
    </div>
  );
}
