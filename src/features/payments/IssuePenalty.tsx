import { PenaltyForm } from "@/features/payments/components/penaltyForm";
import { useGetPenaltiesConfigQuery } from "../penaltiesConfig/penaltyConfigApiSlice";

export const IssuePenalty = () => {
  const {
    data: penalties,
    isLoading,
    isSuccess,
  } = useGetPenaltiesConfigQuery();

  if (isLoading) return <p>Loading...</p>;

  if (isSuccess) {
    const transformedData = penalties.ids.map((penaltyId) => ({
      ...penalties.entities[penaltyId],
    }));
    return <PenaltyForm data={transformedData} />;
  }
};
