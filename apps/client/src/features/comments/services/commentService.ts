import { makeRequest } from "@/shared/utils/axios";
import type { Comment } from "../types/comment.type";

export const fetchComments = async (
	reviewId: number,
	offset = 0,
	limit = 5,
) => {
	return makeRequest<{ items: Comment[]; hasMore: boolean }>(
		`/reviews/${reviewId}/comments?offset=${offset}&limit=${limit}`,
	);
};

export const fetchReplies = async (
	commentId: number,
	offset = 0,
	limit = 3,
) => {
	return makeRequest<{ replies: Comment[]; hasMore: boolean }>(
		`/comments/${commentId}/replies?offset=${offset}&limit=${limit}`,
	);
};

export const createComment = async (data: any) => {
	return makeRequest<Comment>("/comments", {
		method: "POST",
		data,
	});
};

export const updateComment = async (
	commentId: number,
	data: { content: string },
) => {
	return makeRequest<Comment>(`/comments/${commentId}`, {
		method: "PATCH",
		data,
	});
};

export const deleteComment = async (commentId: number) => {
	return makeRequest(`/comments/${commentId}`, {
		method: "DELETE",
	});
};

export const voteComment = async (commentId: number, data: any) => {
	return makeRequest(`/comments/${commentId}/vote`, {
		method: "POST",
		data,
	});
};
