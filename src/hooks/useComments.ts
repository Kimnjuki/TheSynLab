// Re-export Convex comments hooks for backward compatibility
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useCallback } from "react";

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  parent_id: string | null;
  entity_type: 'task' | 'project' | 'setup';
  entity_id: string;
  is_edited: boolean;
  reactions: Record<string, string[]>;
  created_at: string;
  updated_at: string;
  user_profile?: {
    display_name: string | null;
    avatar_url: string | null;
  };
  replies?: Comment[];
}

interface UseCommentsOptions {
  entityType: 'task' | 'project' | 'setup';
  entityId: string;
}

export const useComments = ({ entityType, entityId }: UseCommentsOptions) => {
  const { user } = useAuth();

  const commentsData = useQuery(api.comments.listByEntity, { entityType, entityId });
  const createCommentMutation = useMutation(api.comments.create);
  const updateCommentMutation = useMutation(api.comments.update);
  const deleteCommentMutation = useMutation(api.comments.remove);
  const addReactionMutation = useMutation(api.comments.addReaction);

  // Transform Convex data to match expected format
  const transformComment = (comment: any): Comment => ({
    id: comment._id,
    content: comment.content,
    user_id: comment.userId,
    parent_id: comment.parentId || null,
    entity_type: comment.entityType,
    entity_id: comment.entityId,
    is_edited: comment.isEdited,
    reactions: comment.reactions || {},
    created_at: new Date(comment._creationTime).toISOString(),
    updated_at: new Date(comment._creationTime).toISOString(),
    user_profile: comment.profile ? {
      display_name: comment.profile.displayName,
      avatar_url: comment.profile.avatarUrl,
    } : undefined,
    replies: (comment.replies || []).map(transformComment),
  });

  const comments = ((commentsData || []) as any[]).map(transformComment);

  const addComment = useCallback(async (content: string, parentId?: string) => {
    if (!user) {
      toast.error('Please sign in to comment');
      return null;
    }

    try {
      const result = await createCommentMutation({
        content,
        userId: user.id,
        parentId: parentId as any,
        entityType,
        entityId,
      });
      return result;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      return null;
    }
  }, [user, entityType, entityId, createCommentMutation]);

  const updateComment = useCallback(async (commentId: string, content: string) => {
    try {
      await updateCommentMutation({
        id: commentId as any,
        content,
      });
      toast.success('Comment updated');
    } catch (error: any) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  }, [updateCommentMutation]);

  const deleteComment = useCallback(async (commentId: string) => {
    try {
      await deleteCommentMutation({ id: commentId as any });
      toast.success('Comment deleted');
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  }, [deleteCommentMutation]);

  const addReaction = useCallback(async (commentId: string, emoji: string) => {
    if (!user) {
      toast.error('Please sign in to react');
      return;
    }

    try {
      await addReactionMutation({
        id: commentId as any,
        emoji,
        userId: user.id,
      });
    } catch (error: any) {
      console.error('Error updating reaction:', error);
      toast.error('Failed to update reaction');
    }
  }, [user, addReactionMutation]);

  return {
    comments,
    isLoading: commentsData === undefined,
    addComment,
    updateComment,
    deleteComment,
    addReaction,
    refetch: () => {}, // Convex auto-updates
  };
};
