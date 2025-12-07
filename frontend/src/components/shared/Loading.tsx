import { motion } from "framer-motion";

export const BookIcon = () => (
	<svg
		width="60"
		height="60"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
		<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
	</svg>
);

export const LoadingFallback = () => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		style={{
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
			height: "100vh",
			backgroundColor: "#f8fafc",
		}}
	>
		<motion.div
			animate={{
				rotate: 360,
				scale: [1, 1.1, 1],
			}}
			transition={{
				rotate: {
					duration: 2,
					repeat: Infinity,
					ease: "linear",
				},
				scale: {
					duration: 1.5,
					repeat: Infinity,
					ease: "easeInOut",
				},
			}}
			style={{
				color: "#3b82f6",
				marginBottom: "20px",
			}}
		>
			<BookIcon />
		</motion.div>

		<motion.p
			initial={{ y: 10, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ delay: 0.2 }}
			style={{
				fontSize: "18px",
				color: "#64748b",
				margin: 0,
				fontWeight: "500",
			}}
		>
			Načítavam knižnicu...
		</motion.p>

		<motion.div
			initial={{ width: 0 }}
			animate={{ width: "200px" }}
			transition={{
				duration: 2,
				repeat: Infinity,
				ease: "easeInOut",
			}}
			style={{
				height: "4px",
				backgroundColor: "#e2e8f0",
				borderRadius: "2px",
				marginTop: "20px",
				overflow: "hidden",
				position: "relative",
			}}
		>
			<motion.div
				animate={{
					x: ["0%", "100%"],
				}}
				transition={{
					x: {
						duration: 1.5,
						repeat: Infinity,
						ease: "easeInOut",
					},
				}}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "50px",
					height: "100%",
					backgroundColor: "#3b82f6",
					borderRadius: "2px",
				}}
			/>
		</motion.div>
	</motion.div>
);
