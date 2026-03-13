import { useState } from "react";
import { useComments } from "@/hooks/useComments";
import { useAuth } from "@/contexts/AuthContext";
import { CommentItem } from "./CommentItem";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CommentThreadProps {
  entityType: 'task' | 'project' | 'setup';
  entityId: string;
  title?: string;
}

export function CommentThread({ entityType, entityId, title = "Comments" }: CommentThreadProps) {
  const { user } = useAuth();
  const {
    comments,
    isLoading,
    addComment,
    updateComment,
    deleteComment,
    addReaction,
  } = useComments({ entityType, entityId });

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    await addComment(newComment);
    setNewComment("");
    setIsSubmitting(false);
  };

  const handleReply = async (parentId: string, content: string) => {
    await addComment(content, parentId);
  };

  const totalComments = comments.reduce(
    (sum, c) => sum + 1 + (c.replies?.length || 0),
    0
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="font-semibold">{title}</h3>
        <span className="text-sm text-muted-foreground">
          ({totalComments})
        </span>
      </div>

      {/* New comment input */}
      {user ? (
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback>
              {(user.email || user.name || "U").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={!newComment.trim() || isSubmitting}
                size="sm"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Comment
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground text-sm border rounded-lg">
          Please sign in to leave a comment
        </div>
      )}

      {/* Comments list */}
      <div className="divide-y">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onUpdate={updateComment}
              onDelete={deleteComment}
              onReaction={addReaction}
            />
          ))
        )}
      </div>
    </div>
  );
}
