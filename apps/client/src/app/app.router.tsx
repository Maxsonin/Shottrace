import { createBrowserRouter } from "react-router-dom";
import { getMovie } from "@/features/movies/services/movieService";
import { MainLayout } from "./layouts";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{ index: true, element: <HomePage /> },
			{
				path: "movie/:movieId",
				element: <MoviePage />,
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
