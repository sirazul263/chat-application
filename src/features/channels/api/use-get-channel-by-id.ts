import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetSChannelByIdProps {
  id: Id<"channels">;
}
export const useGetChannelById = ({ id }: UseGetSChannelByIdProps) => {
  const data = useQuery(api.channels.getById, { id });
  const isLoading = data === undefined;
  return { data, isLoading };
};
