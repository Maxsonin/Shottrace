import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { PrismaService } from '../prisma/prisma.service';
import { CommentService } from '../comment/comment.service';
import { createPrismaMock } from '../../test/unit/prisma.mock';

describe('ReviewService - getPaginatedReviews', () => {
  let service: ReviewService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let commentService: CommentService;

  beforeEach(async () => {
    prisma = createPrismaMock();

    // Mock votes to avoid errors in attachCommentsAndVotesToReview
    prisma.vote.findMany.mockResolvedValue([]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: CommentService,
          useValue: { getCommentsByReview: jest.fn().mockResolvedValue([]) },
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    commentService = module.get<CommentService>(CommentService);
  });

  it('should return reviews without filtering when userId is null', async () => {
    prisma.review.findMany.mockResolvedValue([
      { id: 1, content: 'Review 1', reviewerId: 1, createdAt: new Date() },
      { id: 2, content: 'Review 2', reviewerId: 2, createdAt: new Date() },
    ]);

    const limit = 2;
    const result = await service.getPaginatedReviews(null, 10, limit);

    expect(prisma.review.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { movieId: 10 },
        take: limit + 1,
      }),
    );
    expect(result.reviews).toHaveLength(2);
    expect(result.nextCursor).toBeNull();
  });

  it('should handle pagination correctly when userId is provided', async () => {
    const userId = 1;
    const limit = 10;

    // 11 reviews in total (none belong to user)
    const reviewsFromDb = Array.from({ length: 11 }, (_, i) => ({
      id: i + 1,
      content: `Review ${i + 1}`,
      reviewerId: i + 100,
      createdAt: new Date(),
    }));

    prisma.review.findMany.mockResolvedValue(reviewsFromDb);

    const result = await service.getPaginatedReviews(userId, 10, limit);

    expect(result.reviews).toHaveLength(10);
    expect(result.nextCursor).toBe(reviewsFromDb[limit].id);
    expect(result.reviews.some((r) => r.reviewerId === userId)).toBe(false);
  });
});
