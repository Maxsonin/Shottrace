import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Tab,
	Tabs,
	Typography,
} from "@mui/material";
import { useState } from "react";
import type { Movie } from "../types/movie.type";
import CastList from "./CastList";
import MovieDetailsHeader from "./MovieDetailsHeader";

type MovieDetailsProps = {
	movie: Movie;
};

export default function MovieDetails({ movie }: MovieDetailsProps) {
	const { title, poster_path, credits } = movie;

	const [tab, setTab] = useState(0);

	return (
		<Card
			elevation={0}
			sx={{ borderRadius: 2, backgroundColor: "transparent" }}
		>
			<CardContent
				sx={{
					display: "flex",
					flexDirection: { xs: "column", sm: "row" },
					gap: 3,
					maxWidth: { xs: "100%", sm: 1000 },
					margin: "0 auto",
				}}
			>
				{/* Poster */}
				<CardMedia
					component="img"
					image={`https://image.tmdb.org/t/p/w500${poster_path}`}
					alt={title}
					loading="lazy"
					sx={{ width: 250, height: 375, borderRadius: 2 }}
				/>

				{/* Info */}
				<Box>
					<MovieDetailsHeader movie={movie} />

					<Tabs
						value={tab}
						onChange={(_event, newTabIndex) => setTab(newTabIndex)}
						sx={{ mt: 2, mb: 2, borderBottom: 1 }}
					>
						<Tab label="Cast" />
						<Tab label="Crew" />
						<Tab label="Details" />
					</Tabs>

					{tab === 0 && <CastList cast={credits.cast} />}
					{tab === 1 && <Typography>Crew</Typography>}
					{tab === 2 && <Typography>Details</Typography>}
				</Box>
			</CardContent>
		</Card>
	);
}
