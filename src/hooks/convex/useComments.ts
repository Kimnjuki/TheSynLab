import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";

export function useComments(entityType: string, entityId: string) {
  const comments = useQuery(api.comments.listByEntity, { entityType, entityId });

  return {
    comments: (comments || []) as any[],
    isLoading: comments === undefined,
    error: null,
    refetch: () => {}, // Convex auto-updates
  };
}

export function useCreateComment() {
  const createComment = useMutation(api.comments.create);
  const { user } = useAuth();

  return {
    createComment: async (data: {
      content: string;
      entityType: string;
      entityId: string;
      parentId?: string;
    }) => {
      return await createComment({ ...data, userId: user?.id } as any);
    },
    isLoading: false,
  };
}

export function useUpdateComment() {
  const updateComment = useMutation(api.comments.update);

  return {
    updateComment: async (id: string, content: string) => {
      return await updateComment({ id: id as any, content });
    },
    isLoading: false,
  };
}

export function useDeleteComment() {
  const deleteComment = useMutation(api.comments.remove);

  return {
    deleteComment: async (id: string) => deleteComment({ id: id as any }),
    isLoading: false,
  };
}

export function useAddReaction() {
  const addReaction = useMutation(api.comments.addReaction);
  const { user } = useAuth();

  return {
    addReaction: async (id: string, emoji: string) => {
      return await addReaction({ id: id as any, emoji, userId: user?.id });
    },
    isLoading: false,
  };
}

export function useRemoveReaction() {
  const removeReaction = useMutation(api.comments.removeReaction);
  const { user } = useAuth();

  return {
    removeReaction: async (id: string, emoji: string) => {
      return await removeReaction({ id: id as any, emoji, userId: user?.id });
    },
    isLoading: false,
  };
}
