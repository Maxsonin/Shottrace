import {
	Avatar,
	Divider,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { MENU_LINKS } from "./navConfig";

export default function MobileNav({
	closeDrawer,
}: {
	closeDrawer: () => void;
}) {
	const { user, signOut, openSignInDialog, openSignUpDialog } = useAuth();

	return (
		<List>
			{MENU_LINKS.map(({ label, to, icon }) => (
				<ListItemButton
					key={label}
					component={RouterLink}
					to={to}
					onClick={closeDrawer}
				>
					<ListItemIcon>{icon}</ListItemIcon>
					<ListItemText primary={label} />
				</ListItemButton>
			))}

			<Divider />

			{!user ? (
				<>
					<ListItemButton onClick={openSignInDialog}>
						<ListItemText primary="Sign In" />
					</ListItemButton>
					<ListItemButton onClick={openSignUpDialog}>
						<ListItemText primary="Sign Up" />
					</ListItemButton>
				</>
			) : (
				<>
					<ListItemButton>
						<Avatar sx={{ width: 32, height: 32, mr: 1 }} />
						<ListItemText primary={user.username} />
					</ListItemButton>
					<ListItemButton
						onClick={() => {
							signOut();
							closeDrawer();
						}}
					>
						<ListItemText primary="Sign Out" />
					</ListItemButton>
				</>
			)}
		</List>
	);
}
