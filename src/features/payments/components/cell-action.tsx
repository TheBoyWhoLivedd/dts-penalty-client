"use client";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



import {
  DotsHorizontalIcon,
  Pencil1Icon,
 
} from "@radix-ui/react-icons";
import { PaymentColumn } from "./columns";

interface CellActionProps {
  data: PaymentColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {

  // console.log("Data in CellAction", data);
  // const router = useRouter();
  // const params = useParams();
  const navigate = useNavigate();



  // const onCopy = (id: string) => {
  //   navigator.clipboard.writeText(id);
  // };

  return (
    <>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-4 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4 " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {/* <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <CopyIcon className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem> */}
          <DropdownMenuItem
            onClick={() => {
              navigate(`/dash/payments/${data._id}`);
            }}
          >
            <Pencil1Icon className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
