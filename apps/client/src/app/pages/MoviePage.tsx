import { useEffect } from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";
import MovieDetails from "@/features/movies/components/MovieDetails";
import type { Movie } from "@/features/movies/types/movie.type";
import Reviews from "@/features/reviews/components/Reviews";
import type { OutletContextType } from "../layouts/MainLayout/MainLayout";

export default function MoviePage() {
	const movie = useLoaderData() as Movie;

	const { setBackgroundImage } = useOutletContext<OutletContextType>();
	useEffect(() => {
		movie.backdrop_path
			? setBackgroundImage(
					`https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`,
				)
			: setBackgroundImage(undefined);
	}, [movie.backdrop_path, setBackgroundImage]);

	return (
		<>
			<MovieDetails movie={movie} />
			<Reviews movieId={movie.id.toString()} />
		</>
	);
}
