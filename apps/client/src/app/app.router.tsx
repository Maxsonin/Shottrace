import { createBrowserRouter } from "react-router-dom";
import { getMovie } from "@/features/movies/services/movieService";
import { MainLayout } from "./layouts";
import HomePage from "./pages/HomePage";
import ListsPage from "./pages/ListsPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import MoviesPage from "./pages/MoviesPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: "movies", element: <MoviesPage /> },
			{ path: "lists", element: <ListsPage /> },
			{
				path: "movie/:movieId",
				element: <MovieDetailsPage />,
				loader: async ({ params }) => {
					try {
						const data = await getMovie(params.movieId!);
						return data;
					} catch {
						throw new Response("Not Found", { status: 404 });
					}
				},
			},
		],
		errorElement: <NotFoundPage />,
	},
]);
