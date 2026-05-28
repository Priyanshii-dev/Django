import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import instance from "@/api/instance";

import { ApiResponse, UpdateDataParams } from "./types";

const usePutData = <TPayload, TData>({
  url,
  enabled = true,
  mutationOptions = {},
}: {
  url: string;
  enabled?: boolean;
  mutationOptions?: UseMutationOptions<
    TData,
    Error,
    UpdateDataParams<TPayload>
  >;
}) => {
  const mutation = useMutation<TData, Error, UpdateDataParams<TPayload>>({
    mutationFn: async (params) => {
      const { id, payload, headers = {} } = params;

      const finalUrl = id ? `${url}/${id}` : url;

      const response = await instance.put<ApiResponse<TData>>(
        finalUrl,
        payload,
        {
          headers,
        }
      );

      if (!response.data?.error) {
        toast.success(response.data?.message || "Updated successfully.");
        return response.data?.data as TData;
      }

      throw new Error(response.data?.message || "Failed to update resource.");
    },
    ...mutationOptions,
    retry: false,
  });

  if (!enabled) {
    const disabledMutate = (() => {}) as typeof mutation.mutate;
    const disabledMutateAsync = (() =>
      Promise.reject(new Error("Mutation is disabled"))) as typeof mutation.mutateAsync;

    return {
      ...mutation,
      mutate: disabledMutate,
      mutateAsync: disabledMutateAsync,
      isPending: false,
      isSuccess: false,
      isError: false,
      data: mutation.data,
      error: mutation.error,
      reset: mutation.reset,
      status: "idle",
    } as typeof mutation;
  }

  return mutation;
};

export default usePutData;
