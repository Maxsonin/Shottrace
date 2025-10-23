import "./MainLayout.css";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "@/shared/components/layout/Footer";
import Navbar from "@/shared/components/layout/Navbar";

export type OutletContextType = {
	setBackgroundImage: (img: string | undefined) => void;
};

export default function MainLayout() {
	const [backgroundImage, setBackgroundImage] = useState<string | undefined>(
		undefined,
	);

	return (
		<Box
			sx={{
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

			<Container
				sx={{
					position: "relative",
					maxWidth: "950px",
					flex: 1,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Navbar />
				<Box
					component="main"
					sx={{
						flex: 1,
						mt: backgroundImage ? { xs: "100px", sm: "400px" } : "50px",
					}}
				>
					<Outlet context={{ setBackgroundImage } as OutletContextType} />
				</Box>
			</Container>
			<Footer />
		</Box>
	);
}
