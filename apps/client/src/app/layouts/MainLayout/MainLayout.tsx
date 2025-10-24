import "./MainLayout.css";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "@/shared/components/layout/Footer";
import Navbar from "@/shared/components/layout/NavBar/Navbar";

export type OutletContextType = {
	usePageBackground: (img?: string) => void;
};

export default function MainLayout() {
	const [backgroundImage, setBackgroundImage] = useState<string | undefined>(
		undefined,
	);

	// Helper function for pages with automatic cleanup
	const usePageBackground = (img?: string) => {
		useEffect(() => {
			setBackgroundImage(img);
			return () => setBackgroundImage(undefined);
		}, [img]);
	};

	return (
		<>
			<Container
				maxWidth="lg"
				sx={{
					position: "relative", // positioning context for background
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
				}}
			>
				{backgroundImage && (
					<div
						className="background-img-fade"
						style={{ backgroundImage: `url(${backgroundImage})` }}
					/>
				)}

				<Navbar />
				<Box
					component="main"
					sx={{
						flex: 1,
						mt: backgroundImage ? { xs: "100px", sm: "400px" } : "50px",
					}}
				>
					<Outlet context={{ usePageBackground } as OutletContextType} />
				</Box>
			</Container>
			<Footer />
		</>
	);
}
