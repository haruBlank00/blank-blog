import { useNavigate } from "@remix-run/react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function Blogs() {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Manage your blogs</h2>

      <Button onClick={() => navigate("new")}>
        <Plus className="h-4 w-4" />
        Create
      </Button>
    </div>
  );
}
