import {
  createSelector,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { RootState } from "@/app/store";

const paymentsAdapter = createEntityAdapter<PaymentConfig>({});

const initialState = paymentsAdapter.getInitialState();

export const paymentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<EntityState<PaymentConfig, string>, void>({
      query: () => "/payments",
      transformResponse: (responseData: PaymentConfig[]) => {
        const loadedPayments = responseData.map((payment) => {
          payment.id = payment._id;
          return payment;
        });
        return paymentsAdapter.setAll(initialState, loadedPayments);
      },
      providesTags: (result: EntityState<PaymentConfig, string> | undefined) =>
        result
          ? [
              { type: "Payment", id: "LIST" },
              ...result.ids.map((id) => ({ type: "Payment" as const, id })),
            ]
          : [{ type: "Payment", id: "LIST" }],
    }),
  }),
});

export const { useGetPaymentsQuery } = paymentsApiSlice;

export const selectPaymentsResult =
  paymentsApiSlice.endpoints.getPayments.select();

// Creates memoized selector
const selectPaymentsData = createSelector(
  selectPaymentsResult,
  (paymentsResult) => paymentsResult.data
);

export const {
  selectAll: selectAllPayments,
  selectById: selectPaymentById,
  selectIds: selectPaymentIds,
} = paymentsAdapter.getSelectors(
  (state: RootState) => selectPaymentsData(state) ?? initialState
);
