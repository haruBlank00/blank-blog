import { Form, redirect, useNavigate, useNavigation } from "@remix-run/react";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const CellActions = ({ row }: { row: { id: string } }) => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const id = row.id;
  const viewHandler = () => {
    navigate("/dashboard/blogs/" + id);
  };
  const btnDisabled = ["loading", "submitting"].includes(navigation.state);

  const editHandler = () => {};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="h-8 w-8 p-0">
          <span className="sr-only">Open Menu</span>
          <MoreHorizontal className="icon" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem onClick={viewHandler}>
          <Button variant={"ghost"} size={"sm"}>
            <Eye className="icon" /> View
          </Button>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Button variant={"ghost"} size={"sm"}>
            <Pencil className="icon" />
            Edit:
          </Button>
        </DropdownMenuItem>

        <Form action={`${id}/destroy`} method="post">
          <DropdownMenuItem>
            <Button
              type="submit"
              variant={"ghost"}
              size={"sm"}
              disabled={btnDisabled}
            >
              <Trash className="icon" />
              Delete
            </Button>
          </DropdownMenuItem>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CellActions;
