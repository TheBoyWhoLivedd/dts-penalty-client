import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { setCredentials } from "@/features/auth/authSlice";

interface ApiError {
  message: string;
}
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3500";
// "https://ura-project-manager-api.onrender.com"
// "https://ura-project-manager.hitajitech.site"
const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl,
  validateStatus: (response, result) => {
    // console.log(response)
    // First, check if there's an error flag in the result
    if (result && result.isError) return false;

    // Treat status 200-299 as success
    if (response.status >= 200 && response.status <= 300) return true;

    if (response.status >= 400 && response.status <= 500) return false;

    return false;
  },
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

console.log(baseQuery);

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  // console.log(args) // request url, method, body
  // console.log(api) // signal, dispatch, getState()
  // console.log(extraOptions) //custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions);

  // If you want, handle other status codes, too
  if (result?.error?.status === 403) {
    console.log("sending refresh token");

    // send refresh token to get new access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        // Type guard to check if error data is of type ApiError
        if (
          typeof refreshResult.error.data === "object" &&
          refreshResult.error.data &&
          "message" in refreshResult.error.data
        ) {
          const errorData = refreshResult.error.data as ApiError;
          errorData.message = "Your login has expired.";
        }
      }
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Note", "User", "Department", "Phase", "Project", "Task"],
  endpoints: (builder) => ({
    exampleEndpoint: builder.query({
      query: () => `/example`,
    }),
  }),
});
