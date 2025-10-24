import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import { Box, Button, Paper, Rating, Stack, Typography } from "@mui/material";
import { useAuth } from "@/app/providers/AuthProvider";
import Vote from "@/shared/components/ui/Vote";
import { formatDate } from "@/shared/utils/dataFormatter";
import type { Review } from "../types/reviews.type";

type Props = {
	review: Review;
	isUser: boolean;
	onVoteReview: (reviewId: number, value: 1 | -1 | 0, isUser: boolean) => void;
	onChange?: (review: Review) => void;
	onDelete?: (id: number) => void;
	onReply?: () => void;
};

export default function ReviewElement({
	review,
	isUser,
	onVoteReview,
	onChange,
	onDelete,
	onReply,
}: Props) {
	const { user, openSignInDialog } = useAuth();

	return (
		<Paper
			sx={{
				py: 2,
				px: 4,
				border: isUser ? "4px solid" : "2px olid",
				borderColor: isUser ? "green" : "grey.300",
				borderRadius: 5,
			}}
		>
			<Box display={"flex"} justifyContent="space-between">
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Typography fontSize={20}>
						<Box component="span" fontWeight="bold">
							{isUser ? "You" : review.reviewer.username}
						</Box>{" "}
						rated
					</Typography>
					<Rating
						name="read-only-rating"
						value={review.stars}
						precision={0.5}
						readOnly
					/>
				</Box>
				<Typography>
					{formatDate(review.createdAt)}{" "}
					{review.createdAt !== review.updatedAt && (
						<Typography component="span" fontWeight="bold">
							(edited)
						</Typography>
					)}
				</Typography>
			</Box>

			<Typography mt={1}>{review.content}</Typography>

			<Stack direction="row" gap={1} pt={1}>
				<Vote
					votes={review.totalVotes}
					userVote={review.userVote}
					onVote={(value) => {
						if (!user) openSignInDialog();
						else onVoteReview(review.id, value, isUser);
					}}
				/>

				<Button
					color="primary"
					size="small"
					startIcon={<ReplyIcon />}
					onClick={() => {
						if (!user) openSignInDialog();
						else onReply?.();
					}}
				>
					Reply
				</Button>

				{user && isUser && (
					<>
						<Button
							color="warning"
							size="small"
							startIcon={<EditIcon />}
							onClick={() => onChange?.(review)}
						>
							Edit
						</Button>

						<Button
							color="error"
							size="small"
							startIcon={<DeleteIcon />}
							onClick={() => onDelete?.(review.id)}
						>
							Delete
						</Button>
					</>
				)}
			</Stack>
		</Paper>
	);
}
