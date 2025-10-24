import {
	Avatar,
	Button,
	ClickAwayListener,
	Divider,
	Grow,
	MenuItem,
	MenuList,
	Paper,
	Popper,
	Stack,
} from "@mui/material";
import { type MouseEvent, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { MENU_LINKS, navButtonStyle } from "./navConfig";

export default function DesktopNav() {
	const { user, signOut, openSignInDialog, openSignUpDialog } = useAuth();

	const [anchorElUserMenu, setAnchorElUserMenu] = useState<null | HTMLElement>(
		null,
	);

	const handleAvatarClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorElUserMenu((prev) => (prev ? null : event.currentTarget));
	};

	const handleCloseUserMenu = () => setAnchorElUserMenu(null);

	return (
		<Stack
			direction="row"
			spacing={2}
			sx={{ display: { xs: "none", md: "flex" } }}
		>
			{MENU_LINKS.map(({ label, to }) => (
				<Button
					key={label}
					component={RouterLink}
					disableRipple
					to={to}
					sx={navButtonStyle}
				>
					{label}
				</Button>
			))}

			{!user ? (
				<>
					<Button onClick={openSignInDialog} disableRipple sx={navButtonStyle}>
						Sign In
					</Button>
					<Button onClick={openSignUpDialog} disableRipple sx={navButtonStyle}>
						Create Account
					</Button>
				</>
			) : (
				<>
					<Button
						disableRipple
						onClick={handleAvatarClick}
						sx={{
							...navButtonStyle,
							textTransform: "none",
							display: "flex",
							alignItems: "center",
							gap: 1,
						}}
					>
						{user.username}
						<Avatar sx={{ width: 32, height: 32 }} />
					</Button>

					<Popper
						open={Boolean(anchorElUserMenu)}
						anchorEl={anchorElUserMenu}
						placement="bottom-end"
						transition
					>
						{({ TransitionProps }) => (
							<Grow
								{...TransitionProps}
								style={{ transformOrigin: "right top" }}
							>
								<Paper>
									<ClickAwayListener onClickAway={handleCloseUserMenu}>
										<MenuList>
											<MenuItem>My Account</MenuItem>
											<Divider />
											<MenuItem
												onClick={() => {
													signOut();
													handleCloseUserMenu();
												}}
											>
												Sign Out
											</MenuItem>
										</MenuList>
									</ClickAwayListener>
								</Paper>
							</Grow>
						)}
					</Popper>
				</>
			)}
		</Stack>
	);
}
