import {
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Rating,
	Select,
	Typography,
} from "@mui/material";
import type {
	FilterOptions,
	ReviewsPerPageOptions,
	SortOptions,
} from "../types/reviews.type";

type ReviewsFilterOptionsProps = {
	filterOptions: FilterOptions;
	updateFilter: (
		key: keyof FilterOptions,
		value: FilterOptions[keyof FilterOptions],
	) => void;
};

const SORT_OPTIONS: Record<SortOptions, string> = {
	createdAt: "Newest",
	totalVotes: "Votes",
} as const;

const RATING_OPTIONS: ReviewsPerPageOptions[] = [5, 10, 25];

export default function ReviewsFilterOptions({
	filterOptions,
	updateFilter,
}: ReviewsFilterOptionsProps) {
	const { limit, sortBy, rating } = filterOptions;

	return (
		<Box
			display="flex"
			justifyContent="space-between"
			alignItems="center"
			flexWrap="wrap"
			p={2}
		>
			<Typography variant="h5" fontWeight="bold">
				Reviews
			</Typography>

			<Box
				display="flex"
				gap={2}
				justifyContent="center"
				flexWrap="wrap"
				sx={{
					mt: { xs: 2, sm: 0 },
				}}
			>
				{/* Limit */}
				<FormControl size="small">
					<InputLabel>Per page</InputLabel>
					<Select
						label="Per page"
						value={limit}
						onChange={(e) => updateFilter("limit", Number(e.target.value))}
						sx={{ minWidth: 100 }}
					>
						{RATING_OPTIONS.map((ratingOption) => (
							<MenuItem key={ratingOption} value={ratingOption}>
								{ratingOption}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{/* Sort */}
				<FormControl size="small">
					<InputLabel>Sort by</InputLabel>
					<Select
						label="sortBy"
						value={sortBy}
						onChange={(e) =>
							updateFilter("sortBy", e.target.value as FilterOptions["sortBy"])
						}
						sx={{ minWidth: 100 }}
					>
						{Object.entries(SORT_OPTIONS).map(([value, label]) => (
							<MenuItem key={value} value={value}>
								{label}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{/* Rating */}
				<Box display="flex" alignItems="center" gap={1}>
					<Typography fontWeight="bold" variant="subtitle1">
						Stars
					</Typography>
					<Rating
						size="large"
						value={rating}
						precision={0.5}
						onChange={(_event, newRating) =>
							updateFilter("rating", newRating || null)
						}
					/>
				</Box>
			</Box>
		</Box>
	);
}
