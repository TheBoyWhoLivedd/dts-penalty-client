import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { UserColumn, UserColumns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { Heading } from "@/components/ui/heading";
interface UsersClientProps {
  data: UserColumn[];
}

export const UsersClient: React.FC<UsersClientProps> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-[0.5rem] bg-background shadow-md md:shadow-l p-8">
      <div className="flex items-center justify-between ">
        <Heading
          title={`Users (${data.length})`}
          description="Manage your Users"
        />
        <Button onClick={() => navigate("/dash/users/new")}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={UserColumns} data={data} />
    </div>
  );
};
