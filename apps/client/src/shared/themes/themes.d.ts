import "@mui/material/styles";

declare module "@mui/material/styles" {
	interface Palette {
		customColors: {
			like: string;
			dislike: string;
		};
	}
	interface PaletteOptions {
		customColors: {
			like: string;
			dislike: string;
		};
	}
}
