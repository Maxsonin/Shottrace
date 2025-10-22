import {
	Box,
	Button,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Pagination,
	Rating,
	Select,
	Typography,
} from "@mui/material";
import { useId, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useReviews } from "../hooks/useReviews";
import { useUserReview } from "../hooks/useUserReview";
import useVoteReview from "../hooks/useVoteReview";
import type { SortOptions } from "../types/reviews.type";
import ReviewForm from "./ReviewForm";
import ReviewWithComments from "./ReviewWithComments";

export default function Reviews({ movieId }: { movieId: string }) {
	const { user } = useAuth();
	const userId = user?.userId;

	const [writeMode, setWriteMode] = useState(false);
	const [editMode, setEditMode] = useState(false);

	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(5);
	const [sortBy, setSortBy] = useState<"createdAt" | "totalVotes">("createdAt");
	const [rating, setRating] = useState<number | null>(null);

	const reviewsPerPageId = useId();
	const sortById = useId();

	const { userReview, addOrUpdateUserReview, deleteUserReviewHandler } =
		useUserReview(movieId, userId);

	const { reviews, totalPages, reviewsLoading, reviewsError } = useReviews(
		movieId,
		userId,
		limit,
		page,
		sortBy,
		rating,
	);

	const { voteHandler } = useVoteReview(movieId, userId);

	if (reviewsLoading)
		return (
			<Box display="flex" justifyContent="center" alignItems="center" p={2}>
				<CircularProgress />
				<Typography variant="body1" ml={2}>
					Loading reviews...
				</Typography>
			</Box>
		);

	if (reviewsError) console.error(reviewsError);

	return (
		<Box mt={4}>
			{user &&
				(writeMode || editMode ? (
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
				) : userReview ? (
					<Box mb={4}>
						<Typography
							ml={2}
							component="h5"
							fontSize={24}
							fontWeight="bold"
							mb={2}
						>
							Your review
						</Typography>
						<ReviewWithComments
							review={userReview}
							isUser
							onChange={() => setEditMode(true)}
							onVoteReview={voteHandler}
							onDelete={deleteUserReviewHandler}
						/>
					</Box>
				) : (
					<Button
						variant="contained"
						color="success"
						onClick={() => setWriteMode(true)}
						sx={{ margin: "auto", display: "block", my: 2 }}
					>
						Write a review
					</Button>
				))}

			<Box mt={1} display="flex" flexDirection="column">
				<Box
					display="flex"
					justifyContent="space-between"
					mr={2}
					alignItems="center"
				>
					<Typography
						ml={2}
						component="h5"
						fontSize={24}
						fontWeight="bold"
						sx={{ mb: 0 }}
					>
						Reviews
					</Typography>

					<Box display="flex" gap={2} alignItems="center">
						<Typography variant="h6" sx={{ mb: 0 }}>
							Filtering:
						</Typography>

						<FormControl size="small">
							<InputLabel id={reviewsPerPageId}>Per page</InputLabel>
							<Select
								sx={{ width: "100px" }}
								labelId={reviewsPerPageId}
								value={limit}
								onChange={(e) => {
									setLimit(Number(e.target.value));
									setPage(1);
								}}
								label="Per page"
							>
								{[5, 10, 25].map((n) => (
									<MenuItem key={n} value={n}>
										{n}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl size="small">
							<InputLabel id={sortById}>Sort by</InputLabel>
							<Select
								sx={{ width: "100px" }}
								labelId={sortById}
								value={sortBy}
								onChange={(e) => {
									setSortBy(e.target.value as SortOptions);
									setPage(1);
								}}
								label="Sort by"
							>
								<MenuItem value="createdAt">Newest</MenuItem>
								<MenuItem value="totalVotes">Votes</MenuItem>
							</Select>
						</FormControl>

						<Typography fontWeight={"bold"} fontSize={"1.2rem"} sx={{ mb: 0 }}>
							Stars
						</Typography>
						<Rating
							size="large"
							value={rating}
							precision={0.5}
							onChange={(_, newValue) => {
								setRating(newValue || null);
								console.log(newValue);
								setPage(1);
							}}
							sx={{ alignSelf: "center" }}
						/>
					</Box>
				</Box>
				{reviews.length > 0 && (
					<>
						{reviews.map((review) => (
							<ReviewWithComments
								key={review.id}
								review={review}
								isUser={false}
								onVoteReview={voteHandler}
							/>
						))}

						<Box display="flex" justifyContent="center" mt={2}>
							<Pagination
								count={totalPages}
								page={page}
								onChange={(_, value) => setPage(value)}
								shape="rounded"
								size="large"
								showLastButton
								showFirstButton
							/>
						</Box>
					</>
				)}
				{reviews.length === 0 &&
					(!userReview ? (
						<Typography
							mt={4}
							ml={2}
							display={"flex"}
							justifyContent={"center"}
							fontSize={18}
						>
							It's empty here🤷‍♂️
						</Typography>
					) : (
						<Typography ml={2} fontSize={18}>
							Only you reviewed this movie👀
						</Typography>
					))}
			</Box>
		</Box>
	);
}
