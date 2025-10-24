import { Facebook, Instagram, X, YouTube } from "@mui/icons-material";
import {
	Box,
	IconButton,
	Link,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";

const SOCIAL_LINKS = [
	{ name: "Instagram", href: "#", icon: <Instagram />, color: "#E1306C" },
	{ name: "X / Twitter", href: "#", icon: <X />, color: "#000000" },
	{ name: "Facebook", href: "#", icon: <Facebook />, color: "#1877F2" },
	{ name: "YouTube", href: "#", icon: <YouTube />, color: "#FF0000" },
];

const FOOTER_LINKS = [
	{ name: "About", href: "#" },
	{ name: "Pro", href: "#" },
	{ name: "News", href: "#" },
	{ name: "Apps", href: "#" },
	{ name: "Help", href: "#" },
	{ name: "Terms", href: "#" },
	{ name: "API", href: "#" },
	{ name: "Contact", href: "#" },
];

export default function Footer() {
	return (
		<Box
			component="footer"
			sx={{
				mt: 6,
				py: { xs: 4, sm: 6 },
				px: { xs: 2, sm: 3 },
				bgcolor: "background.paper",
			}}
		>
			<Box
				sx={{
					maxWidth: 950,
					mx: "auto",
					display: "flex",
					flexDirection: { xs: "column", sm: "row" },
					justifyContent: "space-between",
					alignItems: { xs: "center", sm: "flex-start" },
				}}
			>
				{/* Footer Links & Text */}
				<Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
					<Stack
						direction="row"
						flexWrap="wrap"
						justifyContent={{ xs: "center", sm: "flex-start" }}
						spacing={1}
					>
						{FOOTER_LINKS.map((link) => (
							<Link key={link.name} href={link.href} underline="none">
								{link.name}
							</Link>
						))}
					</Stack>

					<Typography color="text.secondary" sx={{ mt: 1 }}>
						© Shottrace. Pet project made by Maxim Lesko. Film data from TMDB.
					</Typography>
				</Box>

				{/* Social Media Links */}
				<Stack
					direction="row"
					spacing={1}
					justifyContent={{
						xs: "flex-start",
						sm: "center",
						md: "flex-end",
					}}
					mt={{ xs: 2, sm: 0 }}
				>
					{SOCIAL_LINKS.map(({ name, href, icon, color }) => (
						<Tooltip key={name} title={name} placement="top" arrow>
							<IconButton
								href={href}
								sx={{
									transition: "color 0.3s",
									"&:hover": {
										backgroundColor: "transparent",
										color: color,
									},
								}}
							>
								{icon}
							</IconButton>
						</Tooltip>
					))}
				</Stack>
			</Box>
		</Box>
	);
}
