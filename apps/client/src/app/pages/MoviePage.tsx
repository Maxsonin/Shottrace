import { Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext, useParams } from "react-router-dom";
import MovieDetails from "@/features/movies/components/MovieDetails";
import { getMovie } from "@/features/movies/services/movieService";
import type { Movie } from "@/features/movies/types/movie.type";
import Reviews from "@/features/reviews/components/Reviews";
import type { OutletContextType } from "../layouts/MainLayout";

export default function MoviePage() {
	const { movieId } = useParams<{ movieId: string }>();
	const { setBackgroundImage } = useOutletContext<OutletContextType>();

	const {
		data: movie,
		isLoading,
		error,
	} = useQuery<Movie>({
		queryKey: ["movie", movieId],
		queryFn: () => getMovie(movieId!),
		staleTime: 1000 * 60 * 60,
		enabled: !!movieId,
	});

	if (movie?.backdrop_path) {
		setBackgroundImage(
			`https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`,
		);
	}

	if (isLoading)
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				height="70vh"
			>
				<CircularProgress />
			</Box>
		);

	if (!movieId || !movie || error) return null;
	return (
		<>
			<MovieDetails movie={movie} />
			<Reviews movieId={movieId} />
		</>
	);
}
