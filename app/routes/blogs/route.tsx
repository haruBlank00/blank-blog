import { NavLink, Outlet } from "@remix-run/react";

export default function BlogLayout() {
  return (
    <div className="container max-w-[30rem] mx-auto">
      <nav>
        <ul>
          <li>
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={"/blogs"}>Blog</NavLink>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
