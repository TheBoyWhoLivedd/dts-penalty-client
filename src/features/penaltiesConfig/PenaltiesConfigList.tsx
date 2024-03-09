import { PenaltiesConfigClient } from "./components/client";
import { useGetPenaltiesQuery } from "./penaltyApiSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const PenaltiesList = () => {
  const {
    data: penalties,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPenaltiesQuery(undefined, {
    pollingInterval: 60000,
    // refetchOnFocus: true,
    // refetchOnMountOrArgChange: true,
  });

  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    let errorMessage = "An error occurred";

    if ("status" in error) {
      const fetchError = error as FetchBaseQueryError;
      if (
        fetchError.data &&
        typeof fetchError.data === "object" &&
        "message" in fetchError.data
      ) {
        errorMessage = (fetchError.data as { message: string }).message;
      }
    }

    return <p className="errmsg">{errorMessage}</p>;
  }

  if (isSuccess) {
    // console.log("Penalties", penalties);
    const transformedData = penalties.ids.map((penaltyId) => ({
      ...penalties.entities[penaltyId],
    }));
    // console.log(transformedData);
    return <PenaltiesConfigClient data={transformedData} />;
  }

  return null;
};

export default PenaltiesList;
