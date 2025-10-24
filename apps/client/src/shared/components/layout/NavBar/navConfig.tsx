import ChecklistIcon from "@mui/icons-material/Checklist";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";

export const MENU_LINKS = [
	{ label: "Movies", to: "/movies", icon: <LocalMoviesIcon /> },
	{ label: "Lists", to: "/lists", icon: <ChecklistIcon /> },
];

export const navButtonStyle = {
	textTransform: "uppercase",
	fontSize: 18,
	fontWeight: "bold",
	color: "text.primary",
	backgroundColor: "transparent",
	transition: "color 0.3s ease",
	"&:hover": { color: "text.secondary" },
};
