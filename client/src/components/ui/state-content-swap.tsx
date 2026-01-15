import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/utils/tailwind";

type StateSwapProps = {
	isError?: boolean;
	isSuccess?: boolean;
	isLoading?: boolean;
	children: ReactNode;
	time?: number;
	classNames?: {
		container?: string;
		loading?: string;
		content?: string;
		success?: string;
		error?: string;
	};
};

export type DisplayState = "loading" | "success" | "error" | "content";

export function StateContentSwap({
	isLoading,
	isSuccess,
	isError,
	children,
	time = 2000,
	classNames,
}: StateSwapProps) {
	const [timerExpired, setTimerExpired] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const stateStartTimeRef = useRef<number | null>(null);

	// Derived state - calculate display state from props and timer
	const displayState = useMemo<DisplayState>(() => {
		if (isLoading) {
			return "loading";
		}
		if (isSuccess && !timerExpired) {
			return "success";
		}
		if (isError && !timerExpired) {
			return "error";
		}
		return "content";
	}, [isLoading, isSuccess, isError, timerExpired]);

	// Manage timer for success/error states
	useEffect(() => {
		// Clear any existing timer
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		// Reset timer expired flag when state changes using startTransition
		// to avoid synchronous setState in effect
		if (isSuccess || isError) {
			startTransition(() => {
				setTimerExpired(false);
			});
			stateStartTimeRef.current = Date.now();

			// Set timer to expire after specified time
			timerRef.current = setTimeout(() => {
				startTransition(() => {
					setTimerExpired(true);
				});
				timerRef.current = null;
			}, time);
		} else {
			// Reset when not in success/error state
			startTransition(() => {
				setTimerExpired(false);
			});
			stateStartTimeRef.current = null;
		}

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [isSuccess, isError, time]);

	const showLoading = displayState === "loading";
	const showSuccess = displayState === "success";
	const showError = displayState === "error";
	const showContent = displayState === "content";

	return (
		<div
			className={cn(
				"grid w-full items-center justify-items-center overflow-hidden",
				classNames?.container,
			)}
		>
			<motion.div
				initial={{
					x: 0,
					opacity: showLoading ? 1 : 0,
				}}
				animate={{
					x: showLoading ? 0 : -50,
					opacity: showLoading ? 1 : 0,
				}}
				transition={{
					duration: 0.3,
					ease: "easeInOut",
				}}
				className={cn(
					"col-start-1 col-end-1 row-start-1 row-end-1",
					classNames?.loading,
				)}
			>
				<Spinner />
			</motion.div>
			<motion.div
				initial={{
					x: showSuccess ? 50 : 0,
					opacity: showSuccess ? 1 : 0,
				}}
				animate={{
					x: showSuccess ? 0 : 50,
					opacity: showSuccess ? 1 : 0,
				}}
				transition={{
					duration: 0.3,
					ease: "easeInOut",
				}}
				className={cn(
					"col-start-1 col-end-1 row-start-1 row-end-1",
					classNames?.success,
				)}
			>
				<CheckCircleIcon className="size-6 text-green-500" />
			</motion.div>
			<motion.div
				initial={{
					x: showError ? 50 : 0,
					opacity: showError ? 1 : 0,
				}}
				animate={{
					x: showError ? 0 : 50,
					opacity: showError ? 1 : 0,
				}}
				transition={{
					duration: 0.3,
					ease: "easeInOut",
				}}
				className={cn(
					"col-start-1 col-end-1 row-start-1 row-end-1",
					classNames?.error,
				)}
			>
				<XCircleIcon className="size-6 text-red-500" />
			</motion.div>
			<motion.div
				initial={{
					x: showContent ? 0 : showLoading ? 50 : -50,
					opacity: showContent ? 1 : 0,
				}}
				animate={{
					x: showContent ? 0 : showLoading ? 50 : -50,
					opacity: showContent ? 1 : 0,
				}}
				transition={{
					duration: 0.3,
					ease: "easeInOut",
				}}
				className={cn(
					"col-start-1 col-end-1 row-start-1 row-end-1",
					classNames?.content,
				)}
			>
				{children}
			</motion.div>
		</div>
	);
}
