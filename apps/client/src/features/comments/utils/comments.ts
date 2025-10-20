import theme from "@/shared/themes/default";
import type { Comment } from "../types/comment.type";

/**
 * Returns a background color based on a rating value.
 * Positive ratings lean toward the "like" color, negative toward "dislike",
 * and zero returns the default background.
 */
export function getBgColor(rating: number): string {
	const defaultColor = theme.palette.background.paper;

	if (rating === 0) return defaultColor;

	const ratingThreshold = 20; // Maximum absolute rating for color interpolation
	const clampedRating = Math.max(
		-ratingThreshold,
		Math.min(ratingThreshold, rating),
	);
	const interpolationFactor = Math.abs(clampedRating) / ratingThreshold;

	const likeColor = theme.palette.customColors.like;
	const dislikeColor = theme.palette.customColors.dislike;

	const targetColor = clampedRating > 0 ? likeColor : dislikeColor;
	return interpolateColor(defaultColor, targetColor, interpolationFactor);
}

export function buildCommentTree(comments: Comment[]): Comment[] {
	const map = new Map<number, Comment & { children: Comment[] }>();
	const roots: (Comment & { children: Comment[] })[] = [];

	comments.forEach((c) => {
		map.set(c.id, { ...c, children: [] });
	});

	map.forEach((c) => {
		if (c.parentId) {
			const parent = map.get(c.parentId);
			if (parent) {
				parent.children.push(c);
			}
		} else {
			roots.push(c);
		}
	});

	return roots;
}

/**
 * Linearly interpolates between two RGB colors.
 * @param colorA - Starting color
 * @param colorB - Ending color
 * @param t - Interpolation factor between 0 and 1
 */
function interpolateColor(colorA: string, colorB: string, t: number): string {
	const [rA, gA, bA] = parseRgb(colorA);
	const [rB, gB, bB] = parseRgb(colorB);

	const r = rA + (rB - rA) * t;
	const g = gA + (gB - gA) * t;
	const b = bA + (bB - bA) * t;

	return rgbToString([r, g, b]);
}

// Converts an "rgb(r,g,b)" or "rgba(r,g,b,a)" string to an array of numbers [r, g, b].
function parseRgb(rgbString: string): [number, number, number] {
	const numbers = rgbString.match(/\d+/g);

	if (!numbers) {
		console.error("Invalid RGB string, using default color [255,255,255]");
		return [255, 255, 255]; // fallback to white
	}

	return [Number(numbers[0]), Number(numbers[1]), Number(numbers[2])];
}

// Converts an array of RGB numbers to an "rgb(r,g,b)" string.
function rgbToString([r, g, b]: [number, number, number]): string {
	return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}
