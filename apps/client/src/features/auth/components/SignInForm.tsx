import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { signIn } from "../services/authService";

function SignInForm({ onClose }: { onClose: () => void }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const { signIn: signInAuth } = useAuth();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await signIn({ username, password });
			signInAuth(res.accessToken); // auto-login
			onClose();
		} catch (error) {
			console.error(error);
			alert("Sign in failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 2,
				width: 300,
				p: 2,
			}}
		>
			<TextField
				label="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				required
				fullWidth
			/>

			<TextField
				label="Password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
				fullWidth
			/>

			<Button
				type="submit"
				variant="contained"
				color="primary"
				fullWidth
				disabled={loading}
			>
				{loading ? "Signing In..." : "Sign In"}
			</Button>
		</Box>
	);
}

export default SignInForm;
