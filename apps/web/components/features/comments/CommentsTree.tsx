'use client';

import Comment from './Comment';
import type { CommentDto as CommentType } from '@repo/api';

export type CommentWithChildren = CommentType & {
  children: CommentWithChildren[];
};

export function buildCommentTree(
  comments: CommentType[],
): CommentWithChildren[] {
  const map = new Map<string, CommentWithChildren>();
  const roots: CommentWithChildren[] = [];

  comments.forEach((c) => map.set(c.id, { ...c, children: [] }));

  map.forEach((c) => {
    if (c.parentId) {
      const parent = map.get(c.parentId);
      if (parent) parent.children.push(c);
    } else {
      roots.push(c);
    }
  });

  return roots;
}

type CommentsTreeProps = {
  comments: CommentType[];
  depth?: number;
};

export default function CommentsTree({
  comments,
  depth = 0,
}: CommentsTreeProps) {
  const tree = buildCommentTree(comments);

  if (tree.length === 0) return null;

  return (
    <div className="mt-3 space-y-3">
      {tree.map((node) => (
        <Comment key={node.id} comment={node} depth={depth} />
      ))}
    </div>
  );
}
