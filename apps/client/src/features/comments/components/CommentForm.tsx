import CloseIcon from "@mui/icons-material/Close";
import {
	Button,
	IconButton,
	Paper,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import type React from "react";
import { useState } from "react";

interface CommentFormData {
	initialContent?: string;
	commentId?: number;
	reviewId: number;
	parentId?: number | null;
}

interface CommentFormProps {
	onSubmit: (data: {
		reviewId: number;
		commentId?: number;
		parentId?: number | null;
		content: string;
	}) => void;
	onClose: () => void;
	data: CommentFormData;
}

const CommentForm = ({ onSubmit, onClose, data }: CommentFormProps) => {
	const { initialContent = "", commentId, reviewId, parentId } = data;
	const [content, setContent] = useState(initialContent);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim()) {
			alert("Please write your comment.");
			return;
		}

		onSubmit({ reviewId, commentId, parentId, content });
		setContent("");
	};

	return (
		<Paper
			component="form"
			onSubmit={handleSubmit}
			elevation={4}
			sx={{
				p: 3,
				position: "relative",
			}}
		>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				mb={2}
			>
				<Typography variant="h6" fontWeight="bold">
					{commentId ? "Edit Comment" : "Write a Comment"}
				</Typography>
				<IconButton onClick={onClose} size="small">
					<CloseIcon />
				</IconButton>
			</Stack>

			<TextField
				fullWidth
				multiline
				maxRows={12}
				variant="outlined"
				placeholder="Write your comment here..."
				value={content}
				onChange={(e) => setContent(e.target.value)}
				sx={{ mb: 2 }}
			/>

			<Button type="submit" variant="contained" color="success">
				{commentId ? "Update Comment" : "Submit Comment"}
			</Button>
		</Paper>
	);
};

export default CommentForm;
