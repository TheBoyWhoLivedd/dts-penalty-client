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

import { PenaltyColumn } from "./columns";
import {
  CopyIcon,
  DotsHorizontalIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";
import { useDeletePenaltyConfigMutation } from "../penaltyConfigApiSlice";

interface CellActionProps {
  data: PenaltyColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  // const router = useRouter();
  // const params = useParams();
  const navigate = useNavigate();

  const [deletePenaltyConfig, { isLoading: isDeleteLoading }] =
    useDeletePenaltyConfigMutation();

  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    try {
      const deleteResponse = await deletePenaltyConfig({ id: data.id });
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
        loading={isDeleteLoading}
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
              navigate(`/dash/penalties/${data.id}`);
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
