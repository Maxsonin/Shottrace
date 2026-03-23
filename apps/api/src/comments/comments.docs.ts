import { HttpStatus } from '@nestjs/common';
import {
  CreateCommentDto,
  UpdateCommentDto,
  CommentDto,
  CommentVoteResponseDto,
  UpdateCommentResponseDto,
} from '@repo/api';
import { ApiDocConfig } from 'src/common/decorators/api-doc.decorator';

export const getCommentsDocs: ApiDocConfig = {
  summary: 'Get all comments for a review',
  description:
    'Fetches all comments for a specific review. Returns user vote info if authenticated.',
  auth: false,
  responses: [
    {
      status: HttpStatus.OK,
      description: 'List of comments for the review',
      type: CommentDto,
    },
  ],
};

export const createCommentDocs: ApiDocConfig<CreateCommentDto, CommentDto> = {
  summary: 'Create a comment for a review',
  auth: true,
  body: CreateCommentDto,
  responses: [
    {
      status: HttpStatus.OK,
      description: 'Comment successfully created',
      type: CommentDto,
    },
  ],
};

export const updateCommentDocs: ApiDocConfig<
  UpdateCommentDto,
  UpdateCommentResponseDto
> = {
  summary: 'Update a comment',
  auth: true,
  body: UpdateCommentDto,
  responses: [
    {
      status: HttpStatus.OK,
      description: 'Comment successfully updated',
      type: UpdateCommentResponseDto,
    },
  ],
};

export const deleteCommentDocs: ApiDocConfig = {
  summary: 'Delete a comment',
  description: 'Deletes a comment for a review. Returns id of deleted comment.',
  auth: true,
  responses: [
    {
      status: HttpStatus.OK,
      description: 'Comment was successfully deleted.',
    },
  ],
};

export const voteCommentDocs: ApiDocConfig = {
  summary: 'Vote on a comment',
  description:
    'Allows user to upvote, downvote, or remove their vote on a specific comment. 1 = upvote, -1 = downvote, 0 = remove vote',
  auth: true,
  responses: [
    {
      status: HttpStatus.OK,
      description: 'Voted successfully',
      type: CommentVoteResponseDto,
    },
  ],
};
