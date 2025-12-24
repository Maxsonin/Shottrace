import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { VotesService } from './vote.service';
import { PrismaService } from '../prisma/prisma.service';
import { Vote } from 'prisma/client/generated/client';
import { createMock } from '../../test/utils/create-mock';
import { ReviewVoteDto } from '@repo/api';

describe('VotesService - Reviews', () => {
  let voteService: VotesService;

  const prismaMock = {
    vote: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    review: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  } as unknown as jest.Mocked<PrismaService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        VotesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    voteService = module.get(VotesService);
  });

  it('creates a new vote and increments totalVotes', async () => {
    prismaMock.vote.findUnique.mockResolvedValue(null);
    prismaMock.$transaction.mockResolvedValue([{}, { totalVotes: 5 }]);

    const result = await voteService.voteReview('user1', 'review1', 1);

    expect(result).toEqual({
      reviewId: 'review1',
      userVote: 1,
      totalVotes: 5,
    } as ReviewVoteDto);
  });

  it('removes existing vote and updates totalVotes', async () => {
    prismaMock.vote.findUnique.mockResolvedValue(
      createMock<Vote>({ id: 'vote1', value: 1 }),
    );

    prismaMock.$transaction.mockResolvedValue([{}, { totalVotes: 3 }]);

    const result = await voteService.voteReview('user1', 'review1', 0);

    expect(result).toEqual({
      reviewId: 'review1',
      userVote: 0,
      totalVotes: 3,
    } as ReviewVoteDto);
  });

  it('does not change vote if value is the same', async () => {
    prismaMock.vote.findUnique.mockResolvedValue({
      id: 'vote1',
      value: 1,
    } as any);
    prismaMock.review.findUnique.mockResolvedValue({ totalVotes: 10 } as any);

    const result = await voteService.voteReview('user1', 'review1', 1);

    expect(result).toEqual({
      reviewId: 'review1',
      userVote: 1,
      totalVotes: 10,
    } as ReviewVoteDto);
  });

  it('changes existing vote and updates totalVotes', async () => {
    prismaMock.vote.findUnique.mockResolvedValue({
      id: 'vote1',
      value: -1,
    } as any);
    prismaMock.$transaction.mockResolvedValue([{}, { totalVotes: 7 }]);

    const result = await voteService.voteReview('user1', 'review1', 1);

    expect(result).toEqual({
      reviewId: 'review1',
      userVote: 1,
      totalVotes: 7,
    } as ReviewVoteDto);
  });
});
