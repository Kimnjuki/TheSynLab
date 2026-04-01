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
  
  let createThread: any, createReply: any, toggleLike: any, markSolved: any,
    markSolution: any, likeReply: any, incrementView: any, seedForum: any, reportThread: any, reportReply: any;

  try {
    createThread = useMutation(api.forum.createThread);
    createReply = useMutation(api.forum.createReply);
    toggleLike = useMutation(api.forum.toggleThreadLike);
    markSolved = useMutation(api.forum.markThreadSolved);
    markSolution = useMutation(api.forum.markReplyAsSolution);
    likeReply = useMutation(api.forum.likeReply);
    incrementView = useMutation(api.forum.incrementThreadView);
    seedForum = useMutation(api.forum.seedForum);
    reportThread = useMutation(api.forumModeration.reportThread);
    reportReply = useMutation(api.forumModeration.reportReply);
  } catch {
    const noop = async () => { throw new Error("Forum functions not deployed. Run `npx convex deploy`."); };
    createThread = noop;
    createReply = noop;
    toggleLike = noop;
    markSolved = noop;
    markSolution = noop;
    likeReply = noop;
    incrementView = noop;
    seedForum = noop;
    reportThread = noop;
    reportReply = noop;
  }

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
