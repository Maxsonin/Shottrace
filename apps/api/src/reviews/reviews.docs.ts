import { HttpStatus } from '@nestjs/common';
import {
  CreateReviewDto,
  PaginatedReviewsDto,
  ReviewDto,
  ReviewVoteResponseDto,
  UpdateReviewDto,
  UpdateReviewResponseDto,
  VoteDto,
} from '@repo/api';
import { ApiDocConfig } from 'src/common/decorators/api-doc.decorator';

export const createReviewDocs: ApiDocConfig<CreateReviewDto, ReviewDto> = {
  summary: 'Create a review for a movie',
  auth: true,
  body: CreateReviewDto,
  responses: [
    {
      status: HttpStatus.OK,
      type: ReviewDto,
      description: 'Review was successfully created.',
    },
  ],
};

export const updateReviewDocs: ApiDocConfig<
  UpdateReviewDto,
  UpdateReviewResponseDto
> = {
  summary: 'Update a review for a movie',
  auth: true,
  body: UpdateReviewDto,
  responses: [
    {
      status: HttpStatus.OK,
      description: 'Review was successfully updated.',
      type: UpdateReviewResponseDto,
    },
  ],
};

export const deleteReviewDocs: ApiDocConfig = {
  summary: 'Delete review',
  description: 'Deletes a review for a movie. Returns id of deleted review.',
  auth: true,
  responses: [
    { status: HttpStatus.OK, description: 'Review was successfully deleted.' },
  ],
};

export const getPaginatedReviewsDocs: ApiDocConfig = {
  summary: 'Get paginated reviews for a movie',
  description:
    'Fetches a paginated list of reviews for a specific movie. Excludes reviews from the current user if authenticated.',
  queries: [
    {
      name: 'limit',
      description: 'Number of reviews per page',
      required: false,
      type: Number,
    },
    {
      name: 'page',
      description: 'Page number to retrieve',
      required: false,
      type: Number,
    },
    {
      name: 'sortBy',
      description: 'Field to sort reviews by',
      required: false,
      type: String,
    },
    {
      name: 'rating',
      description: 'Filter reviews by rating',
      required: false,
      type: Number,
    },
  ],
  responses: [
    {
      status: HttpStatus.OK,
      description: 'Paginated list of reviews',
      type: PaginatedReviewsDto,
    },
  ],
};

export const getMyReviewDocs: ApiDocConfig = {
  summary: 'Get the authenticated user’s review for a movie',
  description:
    'Returns the authenticated user’s review for a specific movie. Returns null if no review exists.',
  auth: true,
  responses: [
    {
      status: HttpStatus.OK,
      description: 'User review found',
      type: ReviewDto,
    },
  ],
};

export const voteReviewDocs: ApiDocConfig<VoteDto, ReviewVoteResponseDto> = {
  summary: 'Vote on a review',
  description:
    'Allows user to upvote, downvote, or remove their vote on a specific review. 1 = upvote, -1 = downvote, 0 = remove vote',
  auth: true,
  responses: [
    {
      status: HttpStatus.OK,
      description: 'Voted successfully',
      type: ReviewVoteResponseDto,
    },
  ],
};
