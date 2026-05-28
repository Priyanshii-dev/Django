import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth-store";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: async () => {
      return Promise.resolve();
    },
    onSettled: () => {
      clearAuth();
      router.push("/");
    },
  });
}
