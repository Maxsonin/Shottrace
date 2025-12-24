export function EmptyState({
  emptyBecauseOfFilters,
}: {
  emptyBecauseOfFilters: boolean;
}) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="text-6xl mb-4">🧐</div>
      <h2 className="text-3xl font-bold mb-3">Nothing to see here</h2>
      <p className="text-muted-foreground max-w-md">
        {emptyBecauseOfFilters
          ? 'No reviews match your current filters. Try adjusting them!'
          : 'There are no reviews for this movie yet — be the first to leave one!'}
      </p>
    </div>
  );
}

export function OnlyUserReview() {
  return (
    <div className="flex flex-col items-center py-12 px-4 text-center">
      <div className="text-6xl mb-4">👀</div>
      <h2 className="text-3xl font-bold mb-3">Just you here!</h2>
      <p className="text-muted-foreground max-w-md">
        You’re the only one who reviewed this movie so far. Share it with others
        and let them discover it too!
      </p>
    </div>
  );
}
