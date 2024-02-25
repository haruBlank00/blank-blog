import { NavLink, Outlet } from "@remix-run/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

const navLinks = [
  {
    to: "/dashboard",
    label: "Dashboard",
  },
  {
    to: "/dashboard/blogs",
    label: "Blogs",
  },
];

export default function DashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className=" bg-red-400 py-4">
        <div className="flex justify-between container items-center">
          <span>logo</span>

          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>BA</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex flex-1 bg-pink-400">
        <nav className="w-48 bg-violet-400 ">
          <ul>
            {navLinks.map(({ to, label }) => (
              <li>
                <NavLink
                  to={to}
                  key={label}
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "text-red-400"
                      : isActive
                      ? "text-green-400"
                      : ""
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li>Blogs</li>
          </ul>
        </nav>

        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
