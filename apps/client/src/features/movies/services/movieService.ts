const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

// TODO: move to api
export const getMovie = async (movieId: string) => {
	const res = await fetch(
		`https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits`,
		{
			headers: {
				Authorization: `Bearer ${TMDB_TOKEN}`,
				Accept: "application/json",
			},
		},
	);

	if (!res.ok) throw new Error(`Failed to fetch movie: ${res.statusText}`);

	const data = await res.json();
	console.log(data);
	return data;
};
