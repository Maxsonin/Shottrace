import { Box, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import slugify from "slugify";
import type { Movie } from "../types/movie.type";

type MovieHeaderProps = {
	movie: Movie;
};

export default function MovieDetailsHeader({ movie }: MovieHeaderProps) {
	const { title, release_date, credits, tagline, overview } = movie;

	const movieYear = release_date.split("-")[0];
	const director = credits.crew.find((c) => c.job === "Director")!.name;

	return (
		<Box>
			<Box display="flex" alignItems="baseline" flexWrap="wrap">
				<Typography
					variant="h4"
					color="text.secondary"
					fontWeight="bold"
					mr={1}
				>
					{title}
				</Typography>

				<Link
					component={RouterLink}
					to={`/movies/year/${movieYear}`}
					fontSize={25}
					color="text.primary"
					mr={2}
				>
					{movieYear}
				</Link>

				<Box>
					<Typography
						fontSize={20}
						component="span"
						color="text.primary"
						mr={1}
					>
						Directed by
					</Typography>

					<Link
						component={RouterLink}
						to={`/director/${slugify(director, { lower: true, strict: true })}`}
						color="text.secondary"
						fontSize={23}
					>
						{director}
					</Link>
				</Box>
			</Box>

			{tagline && (
				<Typography
					color="text.secondary"
					sx={{ fontStyle: "italic", pb: 2, pt: 1 }}
				>
					{tagline}
				</Typography>
			)}

			<Typography>{overview}</Typography>
		</Box>
	);
}
