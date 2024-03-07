import { PenaltyForm } from "@/components/penaltyForm";
import { useGetPenaltiesQuery } from "./penaltyApiSlice";

export const IssuePenalty = () => {
  const { data: penalties, isLoading, isSuccess } = useGetPenaltiesQuery();

  if (isLoading) return <p>Loading...</p>;

  if (isSuccess) {
    console.log("fetched penalties", penalties);
    const transformedData = penalties.ids.map((penaltyId) => ({
      ...penalties.entities[penaltyId],
    }));
    console.log("Transormed", transformedData);
    return <PenaltyForm data={transformedData} />;
  }
};
