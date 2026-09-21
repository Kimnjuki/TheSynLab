import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

function useSafeQuery(queryFn: any, args?: any) {
  try {
    const result = useQuery(queryFn, args);
    return { data: result, error: null };
  } catch (e) {
    return { data: undefined, error: e };
  }
}

export function useForumCategories() {
  const { data: categories, error } = useSafeQuery(api.forum.listCategories);
  return {
    categories: categories || [],
    isLoading: !error && categories === undefined,
    error,
  };
}

export function useForumCategory(slug: string) {
  const { data: category, error } = useSafeQuery(api.forum.getCategoryBySlug, { slug });
  return { category, isLoading: !error && category === undefined, error };
}

export function useForumThreads(categoryId?: any) {
  const { data: threads, error } = useSafeQuery(
    api.forum.listThreads,
    categoryId ? { categoryId } : {}
  );
  return {
    threads: threads || [],
    isLoading: !error && threads === undefined,
    error,
  };
}

export function useForumThread(slug: string) {
  const { data: thread, error } = useSafeQuery(api.forum.getThreadBySlug, { slug });
  return {
    thread,
    isLoading: !error && thread === undefined,
    error,
  };
}

export function useForumStats() {
  const { data: stats, error } = useSafeQuery(api.forum.getForumStats);
  return { stats, isLoading: !error && stats === undefined, error };
}

export function useForumSearch(query: string) {
  const { data: results, error } = useSafeQuery(
    api.forum.searchThreads,
    query.length >= 2 ? { query } : "skip"
  );
  return { results: results || [], isLoading: !error && results === undefined };
}

export function useForumActions() {
  const { user } = useAuth();

  // react-hooks/rules-of-hooks: hooks must run unconditionally at the top of the
  // hook body. The previous try/catch around useMutation() was a hook-order
  // violation that could crash the app (React error #300) and never actually
  // fired — Convex mutations only throw at invocation time, not at hook time,
  // so invocation errors are surfaced by the returned wrappers below.
  const createThread = useMutation(api.forum.createThread);
  const createReply = useMutation(api.forum.createReply);
  const toggleLike = useMutation(api.forum.toggleThreadLike);
  const markSolved = useMutation(api.forum.markThreadSolved);
  const markSolution = useMutation(api.forum.markReplyAsSolution);
  const likeReply = useMutation(api.forum.likeReply);
  const incrementView = useMutation(api.forum.incrementThreadView);
  const seedForum = useMutation(api.forum.seedForum);
  const reportThread = useMutation(api.forumModeration.reportThread);
  const reportReply = useMutation(api.forumModeration.reportReply);

  return {
    createThread: async (data: {
      categoryId: any;
      title: string;
      content: string;
      tags?: string[];
    }) => {
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return createThread({
        ...data,
        slug,
        authorId: user?.id || "anonymous",
        authorName: user?.email?.split("@")[0] || "Anonymous",
      });
    },
    createReply: async (threadId: any, content: string, parentReplyId?: any) => {
      return createReply({
        threadId,
        content,
        authorId: user?.id || "anonymous",
        authorName: user?.email?.split("@")[0] || "Anonymous",
        parentReplyId,
      });
    },
    toggleLike: (threadId: any) =>
      toggleLike({ threadId, userId: user?.id || "anonymous" }),
    markSolved: (threadId: any) => markSolved({ threadId }),
    markSolution: (replyId: any, threadId: any) =>
      markSolution({ replyId, threadId }),
    likeReply: (replyId: any) =>
      likeReply({ replyId, userId: user?.id || "anonymous" }),
    incrementView: (threadId: any) => incrementView({ threadId }),
    reportThread: (threadId: any, reason: string) =>
      reportThread({ threadId, reason, reporterId: user?.id }),
    reportReply: (replyId: any, reason: string) =>
      reportReply({ replyId, reason, reporterId: user?.id }),
    seedForum,
  };
}
