import {
	Box,
	Button,
	CircularProgress,
	Pagination,
	Stack,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useReviews } from "../hooks/useReviews";
import { useUserReview } from "../hooks/useUserReview";
import useVoteReview from "../hooks/useVoteReview";
import type {
	FilterOptions,
	ReviewsPerPageOptions,
	SortOptions,
} from "../types/reviews.type";
import ReviewForm from "./ReviewForm";
import ReviewsFilterOptions from "./ReviewsFilterOptions";
import ReviewWithComments from "./ReviewWithComments";

export default function Reviews({ movieId }: { movieId: string }) {
	const { user } = useAuth();
	const userId = user?.userId;

	const [writeMode, setWriteMode] = useState(false);
	const [editMode, setEditMode] = useState(false);

	const [page, setPage] = useState(1);

	const { userReview, addOrUpdateUserReview, deleteUserReviewHandler } =
		useUserReview(movieId, userId);

	const [filters, setFilters] = useState<FilterOptions>({
		limit: 5 as ReviewsPerPageOptions,
		sortBy: "createdAt" as SortOptions,
		rating: null as number | null,
	});

	const updateFilter = <K extends keyof FilterOptions>(
		key: K,
		value: FilterOptions[K],
	) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
		setPage(1);
	};

	const { reviews, totalPages, reviewsLoading } = useReviews(
		movieId,
		userId,
		filters.limit,
		page,
		filters.sortBy,
		filters.rating,
	);

	const { voteHandler } = useVoteReview(movieId, userId, filters);

	if (reviewsLoading)
		return (
			<Box display="flex" justifyContent="center" alignItems="center" p={4}>
				<CircularProgress />
				<Typography variant="body1" ml={2}>
					Loading reviews...
				</Typography>
			</Box>
		);

	const hasReviews = reviews.length > 0;
	const isEmpty = !hasReviews && !userReview;
	const onlyUserReview = !hasReviews && !!userReview;

	const isWritingOrEditing = writeMode || editMode;
	const hasUserReview = !!userReview;

	return (
		<Box mx={2}>
			{user && (
				<>
					{isWritingOrEditing && (
						<ReviewForm
							onSubmit={(data) => {
								addOrUpdateUserReview(data);
								setWriteMode(false);
								setEditMode(false);
							}}
							onClose={() => {
								setWriteMode(false);
								setEditMode(false);
							}}
							data={{
								movieId,
								initialContent: userReview?.content,
								initialStars: userReview?.stars,
								reviewId: userReview?.id,
							}}
						/>
					)}

					{!isWritingOrEditing && hasUserReview && (
						<Box mb={4}>
							<Typography m={2} variant="h5" fontWeight="bold">
								Your Review
							</Typography>
							<ReviewWithComments
								review={userReview}
								isUser
								onChange={() => setEditMode(true)}
								onVoteReview={voteHandler}
								onDelete={deleteUserReviewHandler}
							/>
						</Box>
					)}

					{!isWritingOrEditing && !hasUserReview && (
						<Button
							variant="contained"
							onClick={() => setWriteMode(true)}
							sx={{ display: "block", mx: "auto", my: 8 }}
						>
							Write a review
						</Button>
					)}
				</>
			)}

			<ReviewsFilterOptions
				filterOptions={filters}
				updateFilter={updateFilter}
			/>

			{hasReviews && (
				<>
					<Stack spacing={2}>
						{reviews.map((review) => (
							<ReviewWithComments
								key={review.id}
								review={review}
								isUser={false}
								onVoteReview={voteHandler}
							/>
						))}
					</Stack>

					<Pagination
						count={totalPages}
						page={page}
						onChange={(_event, newPage) => setPage(newPage)}
						shape="rounded"
						size="large"
						showLastButton
						showFirstButton
						sx={{
							display: "flex",
							justifyContent: "center",
							mt: 1,
						}}
					/>
				</>
			)}

			{isEmpty && <EmptyState emptyBecauseOfFilters={!!filters.rating} />}

			{onlyUserReview && <OnlyUserReview />}
		</Box>
	);
}

function EmptyState({
	emptyBecauseOfFilters,
}: {
	emptyBecauseOfFilters: boolean;
}) {
	return (
		<Box display="flex" flexDirection="column" alignItems="center" py={8}>
			<Typography variant="h1" mb={2}>
				🧐
			</Typography>
			<Typography variant="h4" fontWeight="bold" gutterBottom>
				Nothing to see here
			</Typography>
			<Typography color="text.secondary" maxWidth={400} textAlign="center">
				{emptyBecauseOfFilters
					? "No reviews match your current filters. Try changing the filter options!"
					: "There are currently no reviews for this movie. It's your chance to	be the first to leave one!"}
			</Typography>
		</Box>
	);
}

function OnlyUserReview() {
	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			py={8}
			px={2}
			textAlign="center"
		>
			<Typography variant="h1" mb={2}>
				👀
			</Typography>
			<Typography variant="h4" fontWeight="bold" gutterBottom>
				Just you here!
			</Typography>
			<Typography color="text.secondary" maxWidth={400} textAlign="center">
				You’re the only one who reviewed this movie so far. Share this film with
				others and let them discover it too!
			</Typography>
		</Box>
	);
}
