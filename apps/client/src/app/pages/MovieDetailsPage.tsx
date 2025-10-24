import { useLoaderData, useOutletContext } from "react-router-dom";
import MovieDetails from "@/features/movies/components/MovieDetails";
import type { Movie } from "@/features/movies/types/movie.type";
import Reviews from "@/features/reviews/components/Reviews";
import type { OutletContextType } from "../layouts/MainLayout/MainLayout";

export default function MovieDetailsPage() {
	const movie = useLoaderData() as Movie;

	const { usePageBackground } = useOutletContext<OutletContextType>();
	usePageBackground(
		movie.backdrop_path
			? `https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`
			: undefined,
	);

	return (
		<>
			<MovieDetails movie={movie} />
			<Reviews movieId={movie.id.toString()} />
		</>
	);
}
