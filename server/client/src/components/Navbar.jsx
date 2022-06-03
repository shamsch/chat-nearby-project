import { AppBar, Icon, Toolbar, Typography } from "@mui/material";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import CircleIcon from "@mui/icons-material/Circle";
import React from "react";
import { Box } from "@mui/system";
import { useStore } from "../zustand/store";

export const Navbar = () => {
	const userCount = useStore((state) => state.userCount);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Icon edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
						<MarkUnreadChatAltIcon />
					</Icon>
					<Typography
						variant="h5"
						color="inherit"
						component="div"
						sx={{ flexGrow: 1 }}
					>
						Chat nearby
					</Typography>
					<Icon edge="end" aria-label="online" sx={{ mr: 1 }}>
						<CircleIcon sx={{ color: "green" }} />
					</Icon>
					<Typography variant="h6" component="div">
						Online: {userCount}
					</Typography>
				</Toolbar>
			</AppBar>
		</Box>
	);
};
