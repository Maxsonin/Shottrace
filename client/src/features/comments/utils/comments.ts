import type { Comment } from '../types/comment.type';

// rating manages background color
export function getBgColor(rating: number): string {
  if (rating === 0) return 'white';

  const clamped = Math.max(-10, Math.min(10, rating));

  if (clamped > 0) {
    return `hsla(120, 60%, ${95 - clamped * 5}%, 1)`;
  } else {
    return `hsla(0, 60%, ${95 - Math.abs(clamped) * 5}%, 1)`;
  }
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
