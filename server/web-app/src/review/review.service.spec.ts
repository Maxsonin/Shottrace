import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../../test/unit/prisma.mock';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';

const reviewsArray = [
  {
    id: 1,
    content: 'This movie is awesome!',
    stars: 5,
    rating: 25,
    movieId: 1234,
    reviewerId: 1,
    reviewer: { username: 'user1' },
    comments: [
      {
        id: 101,
        content: 'Great review!',
        rating: 10,
        parentId: null,
        commenter: { username: 'commenter1' },
        children: [
          {
            id: 102,
            content: 'I agree',
            rating: 5,
            parentId: 101,
            commenter: { username: 'commenter2' },
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    content: 'This movie is ok.',
    stars: 3,
    rating: 15,
    movieId: 1234,
    reviewerId: 2,
    reviewer: { username: 'user2' },
    comments: [],
  },
  {
    id: 3,
    content: 'This movie is bad.',
    stars: 1,
    rating: 5,
    movieId: 1234,
    reviewerId: 3,
    reviewer: { username: 'user3' },
    comments: [],
  },
];

const oneReview = reviewsArray[0];

describe('ReviewService', () => {
  let service: ReviewService;
  let prisma: PrismaService;

  let db: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    db = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a review', async () => {
      const createDto = plainToInstance(CreateReviewDto, {
        movieId: 1234,
        content: 'Nice!',
        stars: 4,
      });
      const errors = await validate(createDto);
      expect(errors.length).toBe(0);

      const userId = 1111;

      const created = { id: 4, ...createDto, reviewerId: userId };

      db.review.create.mockResolvedValue(created);

      const result = await service.create(userId, createDto);

      expect(db.review.create).toHaveBeenCalledWith({
        data: {
          reviewerId: userId,
          movieId: createDto.movieId,
          content: createDto.content,
          stars: createDto.stars,
        },
      });
      expect(result).toEqual(created);
    });
  });

  describe('update', () => {
    it('should update a review', async () => {
      const updateDto = plainToInstance(UpdateReviewDto, {
        reviewId: oneReview.id,
        content: 'Updated content',
        stars: 1,
      });
      const errors = await validate(updateDto);
      expect(errors.length).toBe(0);

      db.review.update.mockResolvedValue({
        id: oneReview.id,
        content: updateDto.content,
        stars: updateDto.stars,
      });

      const result = await service.update(oneReview.id, updateDto);

      expect(db.review.update).toHaveBeenCalledWith({
        where: { id: oneReview.id },
        data: { content: updateDto.content, stars: updateDto.stars },
      });
      expect(result.content).toBe(updateDto.content);
      expect(result.stars).toBe(updateDto.stars);
    });
  });

  describe('remove', () => {
    it('should delete a review', async () => {
      db.review.delete.mockResolvedValue(oneReview);

      const result = await service.remove(oneReview.id);

      expect(db.review.delete).toHaveBeenCalledWith({
        where: { id: oneReview.id },
      });

      expect(result).toEqual(oneReview);
    });
  });

  describe('findAll', () => {
    it('should return paginated reviews with comments', async () => {
      db.review.findMany.mockResolvedValue(reviewsArray);

      db.comment.findMany.mockImplementation(({ where }) => {
        const review = reviewsArray.find((r) => r.id === where.reviewId);
        return Promise.resolve(
          review ? review.comments.flatMap((c) => [c, ...c.children]) : [],
        );
      });

      const result: any = await service.findAll(1234, 10);

      expect(db.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { movieId: 1234 },
          take: 10,
          orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
          include: {
            reviewer: { select: { username: true } },
          },
        }),
      );

      expect(result.data[0]).toHaveProperty('comments');

      const firstReviewComments = result.data[0].comments;

      expect(firstReviewComments).toHaveLength(1);

      expect(firstReviewComments[0].content).toBe('Great review!');
      expect(firstReviewComments[0].rating).toBe(10);
      expect(firstReviewComments[0].commenter.username).toBe('commenter1');

      expect(firstReviewComments[0].children).toHaveLength(1);

      expect(firstReviewComments[0].children[0].content).toBe('I agree');
      expect(firstReviewComments[0].children[0].commenter.username).toBe(
        'commenter2',
      );
      expect(firstReviewComments[0].children[0].children).toHaveLength(0);

      // Because 3 < 10, nextCursor is null (no more pages)
      expect(result.nextCursor).toBeNull();
    });

    it('should set nextCursor if more reviews exist', async () => {
      // Simulate more reviews than the limit (e.g., limit = 2, but we have 3 reviews)
      const limit = 2;
      const paginatedReviews = reviewsArray.slice(0, limit);

      db.review.findMany.mockResolvedValue(paginatedReviews);

      db.comment.findMany.mockImplementation(({ where }) => {
        const review = reviewsArray.find((r) => r.id === where.reviewId);
        return Promise.resolve(
          review ? review.comments.flatMap((c) => [c, ...c.children]) : [],
        );
      });

      const result: any = await service.findAll(1234, limit);

      expect(result.data).toHaveLength(limit);

      // The nextCursor should be the ID of the last review in the returned page
      expect(result.nextCursor).toBe(
        paginatedReviews[paginatedReviews.length - 1].id,
      );

      expect(result.data[0]).toHaveProperty('comments');
      expect(result.data[0].comments).toHaveLength(1);
      expect(result.data[0].comments[0].content).toBe('Great review!');
    });
  });

  describe('buildCommentTree', () => {
    it('should correctly build a deeply nested comment tree with multiple siblings including new sibling comment', () => {
      const comments = [
        {
          id: 1,
          content: 'Root comment 1',
          rating: 10,
          parentId: null,
          commenter: { username: 'user1' },
        },
        {
          id: 2,
          content: 'Child comment 1.1',
          rating: 8,
          parentId: 1,
          commenter: { username: 'user2' },
        },
        {
          id: 3,
          content: 'Child comment 1.2',
          rating: 7,
          parentId: 1,
          commenter: { username: 'user3' },
        },
        {
          id: 4,
          content: 'Grandchild comment 1.2.1',
          rating: 5,
          parentId: 3,
          commenter: { username: 'user4' },
        },
        {
          id: 5,
          content: 'Great great grandchild 1.2.1.1',
          rating: 4,
          parentId: 4,
          commenter: { username: 'user5' },
        },
        {
          id: 10,
          content: 'Grandchild comment 1.2.2',
          rating: 3,
          parentId: 3,
          commenter: { username: 'user10' },
        },
        {
          id: 6,
          content: 'Root comment 2',
          rating: 9,
          parentId: null,
          commenter: { username: 'user6' },
        },
        {
          id: 7,
          content: 'Child comment 2.1',
          rating: 6,
          parentId: 6,
          commenter: { username: 'user7' },
        },
        {
          id: 8,
          content: 'Child comment 2.2',
          rating: 5,
          parentId: 6,
          commenter: { username: 'user8' },
        },
        {
          id: 9,
          content: 'Root comment 3',
          rating: 2,
          parentId: null,
          commenter: { username: 'user9' },
        },
      ];

      // @ts-ignore
      const tree = service.buildCommentTree(comments);

      // Expect 3 root comments
      expect(tree).toHaveLength(3);

      // Root comment 1 has two children
      expect(tree[0].content).toBe('Root comment 1');
      expect(tree[0].children).toHaveLength(2);

      // Root comment 1 children
      expect(tree[0].children[0].content).toBe('Child comment 1.1');
      expect(tree[0].children[0].children).toHaveLength(0);

      // Root comment 2 children
      expect(tree[0].children[1].content).toBe('Child comment 1.2');
      expect(tree[0].children[1].children).toHaveLength(2);

      const grandchildren = tree[0].children[1].children;

      // Check first grandchild (existing)
      expect(grandchildren[0].content).toBe('Grandchild comment 1.2.1');
      expect(grandchildren[0].children).toHaveLength(1);

      // Check great-grandchild of the first grandchild
      expect(grandchildren[0].children[0].content).toBe(
        'Great great grandchild 1.2.1.1',
      );
      expect(grandchildren[0].children[0].children).toHaveLength(0);

      // Check second grandchild
      expect(grandchildren[1].content).toBe('Grandchild comment 1.2.2');
      expect(grandchildren[1].children).toHaveLength(0);

      // Root comment 2 has two children
      expect(tree[1].content).toBe('Root comment 2');
      expect(tree[1].children).toHaveLength(2);
      expect(tree[1].children[0].content).toBe('Child comment 2.1');
      expect(tree[1].children[1].content).toBe('Child comment 2.2');

      // Root comment 3 has no children
      expect(tree[2].content).toBe('Root comment 3');
      expect(tree[2].children).toHaveLength(0);
    });
  });
});
