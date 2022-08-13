import useSWR from "swr";
import { fetcher } from "../utils/fetcher";

export const useUser = (id: number) => {
  const { data, error } = useSWR(`/api/users/${id}`, fetcher);

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
};
