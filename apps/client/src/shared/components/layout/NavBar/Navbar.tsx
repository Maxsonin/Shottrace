import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Drawer, IconButton, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export default function Navbar() {
	const { loading } = useAuth();

	const [isMobileOpen, setIsMobileOpen] = useState(false);

	const handleDrawerToggle = () => setIsMobileOpen((prev) => !prev);

	return (
		<AppBar position="static" color="transparent" elevation={0}>
			<Toolbar sx={{ justifyContent: "space-between" }}>
				<Typography fontSize={25} fontWeight="bold" component={Link} to="/">
					{/* TODO: Change to SVG logo */}
					Shottrace
				</Typography>

				{!loading && (
					<>
						<DesktopNav />

						<IconButton
							color="inherit"
							edge="end"
							onClick={handleDrawerToggle}
							sx={{ borderRadius: 1, display: { xs: "flex", md: "none" } }}
						>
							<MenuIcon />
						</IconButton>
					</>
				)}
			</Toolbar>

			<Drawer anchor="top" open={isMobileOpen} onClose={handleDrawerToggle}>
				<MobileNav closeDrawer={() => setIsMobileOpen(false)} />
			</Drawer>
		</AppBar>
	);
}
