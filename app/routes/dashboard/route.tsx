import { Outlet } from "@remix-run/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export default function Dashboard() {
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
            <li>Home</li>
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
