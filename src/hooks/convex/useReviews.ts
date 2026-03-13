import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";

export function useReviews(productId: string) {
  const reviews = useQuery(api.reviews.listByProduct, { productId: productId as any });

  return {
    reviews: (reviews || []) as any[],
    isLoading: reviews === undefined,
    error: null,
    refetch: () => {}, // Convex auto-updates
  };
}

export function useUserReview(productId: string) {
  const { user } = useAuth();
  const review = useQuery(api.reviews.getUserReview, { 
    productId: productId as any,
    userId: user?.id,
  });

  return {
    review,
    isLoading: review === undefined,
    error: null,
  };
}

export function useCreateReview() {
  const createReview = useMutation(api.reviews.create);
  const { user } = useAuth();

  return {
    createReview: async (data: any) => createReview({ ...data, userId: user?.id }),
    isLoading: false,
  };
}

export function useUpdateReview() {
  const updateReview = useMutation(api.reviews.update);

  return {
    updateReview: async (data: any) => updateReview(data as any),
    isLoading: false,
  };
}

export function useDeleteReview() {
  const deleteReview = useMutation(api.reviews.remove);

  return {
    deleteReview: async (id: string) => deleteReview({ id: id as any }),
    isLoading: false,
  };
}

export function useVoteHelpful() {
  const voteHelpful = useMutation(api.reviews.voteHelpful);
  const { user } = useAuth();

  return {
    voteHelpful: async (reviewId: string) => voteHelpful({ 
      reviewId: reviewId as any,
      userId: user?.id,
    }),
    isLoading: false,
  };
}

export function useHasVotedHelpful(reviewId: string) {
  const { user } = useAuth();
  const hasVoted = useQuery(api.reviews.hasVotedHelpful, { 
    reviewId: reviewId as any,
    userId: user?.id,
  });

  return {
    hasVoted: hasVoted ?? false,
    isLoading: hasVoted === undefined,
  };
}
