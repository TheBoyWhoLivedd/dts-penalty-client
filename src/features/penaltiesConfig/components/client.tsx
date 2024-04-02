import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { PenaltyColumn, PenaltyColumns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
interface PenaltysClientProps {
  data: PenaltyColumn[];
}

export const PenaltiesConfigClient: React.FC<PenaltysClientProps> = ({
  data,
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-[0.5rem] bg-background shadow-md md:shadow-l p-8">
      <div className="flex items-center justify-between ">
        <Heading
          title={`Penalties (${data.length})`}
          description="Manage your Penalties"
        />
        <Button onClick={() => navigate("/dash/penalties/new")}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="penaltyTitle"
        columns={PenaltyColumns}
        data={data}
      />
    </div>
  );
};
