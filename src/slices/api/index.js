import { useCallback } from "react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

// import { logoutUserSuccess } from "slices/auth/login/reducer";
import generateEndPoint from "../../V3/utils/generateEndPoint";
import { tagTypes } from "../../V3/tagTypes";
import { BACKEND_BASE_URL } from "../../V2/services/apiEndpoints";

const displayErrorMessage = (error) => {
  console.log(error, "errorrr");

  const statusCode = error?.originalStatus || error?.data?.StatusCode || 0;
  if (Math.floor(statusCode / 100) === 2) return;
  let errorMessage;
  switch (error?.data?.StatusCode) {
    case 400:
      errorMessage = error?.data?.Error || "Invalid data";
      break;
    case 401:
      errorMessage = error?.data?.Error || "Unauthenticated";
      break;
    case 403:
      errorMessage = error?.data?.Error || "No access for given URL";
      break;
    case 404:
      errorMessage = error?.data?.Error || "Page not found";
      break;
    case 500:
      errorMessage = error?.data?.Error || "Internal server error";
      break;
    default:
      errorMessage =
        error?.data?.errorMessage ||
        error?.data?.message ||
        error?.data?.error ||
        "Something went wrong, Please try again";
  }
  toast.error(errorMessage);
};

const transformResponse = (response) => {
  return {
    data: response,
  };
};

const onQueryStarted = async (
  { toastMessage, errorMessage },
  { queryFulfilled, dispatch }
) => {
  try {
    const res = await queryFulfilled;
    if (toastMessage || res?.data?.Message) {
      toast.success(toastMessage || res?.data?.Message);
    }
  } catch ({ error }) {
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      displayErrorMessage(error);
    }
    if (error.status === 401) {
      // dispatch(logoutUserSuccess());
      dispatch(api.util.resetApiState());
    }
  }
};

export const api = createApi({
  reducerPath: "api",
  tagTypes: [...Object.values(tagTypes)],
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");

      if (token) headers.set("Authorization", `Bearer ${token}`);
      else window.location.replace("/signin");
    },
  }),
  endpoints: (builder) => ({
    get: builder.query({
      query: ({ endpoint, query = null }) => {
        if (query) {
          const updatedQuery = Object.entries(query).reduce(
            (res, [key, value]) =>
              value === "" ? res : { ...res, [key]: value },
            {}
          );
          return generateEndPoint(endpoint, updatedQuery);
        }
        return generateEndPoint(endpoint);
      },
      providesTags: (_, __, { tags = [] }) => tags,
      transformResponse,
      onQueryStarted,
    }),
    post: builder.mutation({
      query: ({ endpoint, payload, query = null }) => {
        const postEndpoint = generateEndPoint(endpoint, query);
        return {
          url: postEndpoint,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: (_, __, { tags = [] }) => tags,
      transformResponse,
      onQueryStarted,
    }),
    put: builder.mutation({
      query: ({ endpoint, payload, query = null }) => {
        const putEndpoint = generateEndPoint(endpoint, query);
        return {
          url: putEndpoint,
          method: "PUT",
          body: payload,
        };
      },
      invalidatesTags: (_, __, { tags = [] }) => tags,
      transformResponse,
      onQueryStarted,
    }),
    delete: builder.mutation({
      query: ({ endpoint, query = null }) => {
        const deleteEndpoint = generateEndPoint(endpoint, query);
        return {
          url: deleteEndpoint,
          method: "DELETE",
        };
      },
      invalidatesTags: (_, __, { tags = [] }) => tags,
      onQueryStarted,
    }),
    downloadExcel: builder.query({
      queryFn: async (
        { endpoint, sheetName = "", query = null },
        _,
        __,
        baseQuery
      ) => {
        const result = await baseQuery({
          url: generateEndPoint(endpoint, query),
          responseHandler: (response) => response.blob(),
        });
        const hiddenElement = document.createElement("a");
        const blobExcel = URL.createObjectURL(result.data);
        hiddenElement.href = blobExcel;
        hiddenElement.download = `${sheetName}_report.xlsx`;
        hiddenElement.click();
        return { data: null };
      },
    }),
  }),
});

export const {
  useGetQuery,
  useLazyGetQuery,
  usePostMutation,
  usePutMutation,
  useDeleteMutation,
  useLazyDownloadExcelQuery,
} = api;

export const useLazyCachedGetQuery = (...args) => {
  const [get, metadata] = useLazyGetQuery(...args);
  const cachedGet = useCallback((...args) => get(...args, true), [get]);

  return [cachedGet, metadata];
};
