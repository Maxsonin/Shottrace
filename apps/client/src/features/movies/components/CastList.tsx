import { Box, Button, Tooltip } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import slugify from "slugify";
import type { MovieWithStats } from "../types/movie.type";

export default function CastList({
	cast,
}: {
	cast: MovieWithStats["credits"]["cast"];
}) {
	const [showAll, setShowAll] = useState(false);
	const visibleCast = showAll ? cast : cast?.slice(0, 15);

	return (
		<Box display="flex" flexWrap="wrap" gap={1}>
			{visibleCast?.map((actor) => (
				<Tooltip key={actor.cast_id} title={`as ${actor.character}`}>
					<Button
						variant="outlined"
						size="small"
						component={RouterLink}
						to={`/actor/${slugify(actor.name, { lower: true })}`}
						sx={{ borderRadius: 5, fontSize: "0.75rem", padding: "2px 8px" }}
					>
						{actor.name}
					</Button>
				</Tooltip>
			))}

			{cast?.length > 15 && (
				<Button
					size="small"
					onClick={() => setShowAll((prev) => !prev)}
					sx={{ fontSize: "0.75rem", alignSelf: "center" }}
				>
					{showAll ? "Show Less" : "Show More"}
				</Button>
			)}
		</Box>
	);
}
