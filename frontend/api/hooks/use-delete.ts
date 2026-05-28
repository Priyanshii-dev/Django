import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import instance from "@/api/instance";
import { ApiError, ApiResponse } from "./types";

const useDeleteData = <TData = ApiResponse<null>>({
  url,
  mutationOptions = {},
  refetchQueries,
}: {
  url: string;
  mutationOptions?: UseMutationOptions<TData, ApiError, string>;
  refetchQueries?: string[];
}) => {
  const queryClient = useQueryClient();
  return useMutation<TData, ApiError, string>({
    mutationFn: async (id: string) => {
      const response = await instance.delete(`${url}${String(id)}`);

      if (response?.status === 200 || response?.data?.statusCode === 200) {
        toast.success(response?.data?.message || "Deleted successfully.");
        return response.data?.data;
      }

      throw new Error(response?.data?.message || "Failed to delete resource.");
    },
    onSuccess: async () => {
      if (refetchQueries) {
        await Promise.all(
          refetchQueries.map((queryKey) =>
            queryClient.refetchQueries({ queryKey: [queryKey] })
          )
        );
      }
    },
    ...mutationOptions,
    retry: false,
  });
};

export default useDeleteData;
