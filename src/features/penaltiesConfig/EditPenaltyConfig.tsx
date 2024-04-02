import { useParams } from "react-router-dom";
import { useGetPenaltiesConfigQuery } from "./penaltyConfigApiSlice";
import PenaltyConfigForm from "./components/penaltyConfigForm";

const EditPenaltyConfig = () => {
  const { id } = useParams<string>();

  const { penalty } = useGetPenaltiesConfigQuery(undefined, {
    selectFromResult: ({ data }) => ({
      penalty: id ? data?.entities[id] : undefined,
    }),
  });

  if (!penalty) return <p>Loading...</p>;

  return <PenaltyConfigForm initialData={penalty} />;
};

export default EditPenaltyConfig;
