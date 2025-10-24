import { ThumbDown, ThumbUp } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";

type VoteProps = {
	votes: number;
	userVote: 1 | -1 | 0;
	onVote: (value: 1 | -1 | 0) => void;
};

export default function Vote({ votes, userVote, onVote }: VoteProps) {
	return (
		<Stack direction="row" spacing={0.5} alignItems="center">
			{/* Upvote */}
			<IconButton
				size="small"
				color={userVote === 1 ? "success" : "default"}
				onClick={() => onVote(userVote === 1 ? 0 : 1)}
			>
				<ThumbUp fontSize="small" />
			</IconButton>

			{/* Vote count */}
			<Typography variant="body2" sx={{ width: 20, textAlign: "center" }}>
				{votes}
			</Typography>

			{/* Downvote */}
			<IconButton
				size="small"
				color={userVote === -1 ? "error" : "default"}
				onClick={() => onVote(userVote === -1 ? 0 : -1)}
			>
				<ThumbDown fontSize="small" />
			</IconButton>
		</Stack>
	);
}
