import { Box, Button, Tooltip } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import slugify from "slugify";
import type { Movie } from "../types/movie.type";

type CastListProps = {
	cast: Movie["credits"]["cast"];
};

const MAX_CAST_COUNT = 15;

export default function CastList({ cast }: CastListProps) {
	const [showAll, setShowAll] = useState(false);

	const visibleCast = showAll ? cast : cast.slice(0, MAX_CAST_COUNT);

	return (
		<Box display="flex" flexWrap="wrap" gap={1}>
			{visibleCast.map(({ name, character, cast_id }) => (
				<Tooltip key={cast_id} title={`as ${character}`}>
					<Button
						variant="outlined"
						size="small"
						component={RouterLink}
						to={`/actor/${slugify(name, { lower: true, strict: true })}`}
						sx={{ borderRadius: 5, fontSize: "0.75rem", px: 1, py: 0.5 }}
					>
						{name}
					</Button>
				</Tooltip>
			))}

			{cast.length > MAX_CAST_COUNT && (
				<Button
					size="small"
					onClick={() => setShowAll(!showAll)}
					sx={{ fontSize: "0.75rem" }}
				>
					{showAll ? "Show Less" : "Show More"}
				</Button>
			)}
		</Box>
	);
}
