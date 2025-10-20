const dataFormatter = new Intl.DateTimeFormat(undefined, {
	dateStyle: "medium",
	timeStyle: "short",
});

export const formatDate = (date: string) =>
	dataFormatter.format(Date.parse(date));
