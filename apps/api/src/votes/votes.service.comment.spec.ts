import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { VotesService } from './vote.service';
import { PrismaService } from '../prisma/prisma.service';
import { CommentVoteDto } from '@repo/api';

describe('VotesService - Comments', () => {
  let service: VotesService;

  const prismaMock = {
    vote: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    comment: {
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

    service = module.get(VotesService);
  });

  it('creates a new comment vote', async () => {
    prismaMock.vote.findUnique.mockResolvedValue(null);
    prismaMock.$transaction.mockResolvedValue([{}, { totalVotes: 2 }]);

    const result = await service.voteComment('user1', 'comment1', 1);

    expect(result).toEqual({
      commentId: 'comment1',
      userVote: 1,
      totalVotes: 2,
    } as CommentVoteDto);
  });

  it('removes existing comment vote', async () => {
    prismaMock.vote.findUnique.mockResolvedValue({
      id: 'vote1',
      value: 1,
    } as any);
    prismaMock.$transaction.mockResolvedValue([{}, { totalVotes: 0 }]);

    const result = await service.voteComment('user1', 'comment1', 0);

    expect(result).toEqual({
      commentId: 'comment1',
      userVote: 0,
      totalVotes: 0,
    } as CommentVoteDto);
  });

  it('does not change comment vote if value is the same', async () => {
    prismaMock.vote.findUnique.mockResolvedValue({
      id: 'vote1',
      value: -1,
    } as any);
    prismaMock.comment.findUnique.mockResolvedValue({ totalVotes: -1 } as any);

    const result = await service.voteComment('user1', 'comment1', -1);

    expect(result).toEqual({
      commentId: 'comment1',
      userVote: -1,
      totalVotes: -1,
    } as CommentVoteDto);
  });

  it('changes existing comment vote and updates totalVotes', async () => {
    prismaMock.vote.findUnique.mockResolvedValue({
      id: 'vote1',
      value: 1,
    } as any);
    prismaMock.$transaction.mockResolvedValue([{}, { totalVotes: -1 }]);

    const result = await service.voteComment('user1', 'comment1', -1);

    expect(result).toEqual({
      commentId: 'comment1',
      userVote: -1,
      totalVotes: -1,
    } as CommentVoteDto);
  });
});
