// import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { PaymentColumn, PaymentColumns } from "./columns";
import { Separator } from "@/components/ui/separator";
// import { PlusIcon } from "@radix-ui/react-icons";
// import { useNavigate } from "react-router-dom";
interface PaymentsClientProps {
  data: PaymentColumn[];
}

export const PaymentsClient: React.FC<PaymentsClientProps> = ({ data }) => {
  // const navigate = useNavigate();

  return (
    <div className="p-2 md:p-5 lg:px-25 bg-background rounded-md">
      <div className="flex items-center justify-between">
        <Heading
          title={`Issued PRNs (${data.length})`}
          description=""
        />
        {/* <Button onClick={() => navigate("/dash/payments/new")}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Button> */}
      </div>
      <Separator />
      <DataTable searchKey="prn" columns={PaymentColumns} data={data} />
    </div>
  );
};
