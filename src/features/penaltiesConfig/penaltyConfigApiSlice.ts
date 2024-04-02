import {
  createSelector,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { RootState } from "@/app/store";

const penaltiesAdapter = createEntityAdapter<PenaltyConfig>({});

const initialState = penaltiesAdapter.getInitialState();

export const penaltiesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPenaltiesConfig: builder.query<EntityState<PenaltyConfig, string>, void>(
      {
        query: () => "/penalties",
        transformResponse: (responseData: PenaltyConfig[]) => {
          const loadedPenalties = responseData.map((penalty) => {
            penalty.id = penalty._id;
            return penalty;
          });
          return penaltiesAdapter.setAll(initialState, loadedPenalties);
        },
        providesTags: (
          result: EntityState<PenaltyConfig, string> | undefined
        ) =>
          result
            ? [
                { type: "Penalty", id: "LIST" },
                ...result.ids.map((id) => ({ type: "Penalty" as const, id })),
              ]
            : [{ type: "Penalty", id: "LIST" }],
      }
    ),
    addNewPenaltyConfig: builder.mutation({
      query: (penaltyData) => ({
        url: "/penalties",
        method: "POST",
        body: penaltyData,
      }),
      invalidatesTags: [{ type: "Penalty", id: "LIST" }],
    }),
    updatePenaltyConfig: builder.mutation({
      query: ({ id, ...penaltyData }) => ({
        url: `/penalties/${id}`,
        method: "PATCH",
        body: penaltyData,
      }),
      invalidatesTags: [{ type: "Penalty", id: "LIST" }],
    }),
    deletePenaltyConfig: builder.mutation({
      query: ({ id }) => ({
        url: `/penalties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Penalty", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPenaltiesConfigQuery,
  useAddNewPenaltyConfigMutation,
  useUpdatePenaltyConfigMutation,
  useDeletePenaltyConfigMutation,
} = penaltiesApiSlice;

export const selectPenaltiesResult =
  penaltiesApiSlice.endpoints.getPenaltiesConfig.select();

// creates memoized selector
const selectPenaltiesData = createSelector(
  selectPenaltiesResult,
  (penaltiesResult) => penaltiesResult.data
);

export const {
  selectAll: selectAllPenalties,
  selectById: selectPenaltyById,
  selectIds: selectPenaltyIds,
} = penaltiesAdapter.getSelectors(
  (state: RootState) => selectPenaltiesData(state) ?? initialState
);
