"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modals/alert-modal";

import { UserColumn } from "./columns";
import {
  CopyIcon,
  DotsHorizontalIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";
import { useDeleteUserMutation } from "../usersApiSlice";

interface CellActionProps {
  data: UserColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  // const router = useRouter();
  // const params = useParams();
  const navigate = useNavigate();

  const [
    deleteUser,
    // { isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError },
  ] = useDeleteUserMutation();

  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading] = useState(false);

  const onConfirm = async () => {
    try {
      const deleteResponse = await deleteUser({ id: data.id });
      console.log(deleteResponse);
      if ("data" in deleteResponse && deleteResponse.data) {
        toast({
          title: "Success",
          description: deleteResponse.data.message,
        });
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <CopyIcon className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigate(`/dash/users/${data.id}`);
            }}
          >
            <Pencil1Icon className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <TrashIcon className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
