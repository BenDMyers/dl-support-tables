const buildDate = new Date();
const formattedBuildDate = buildDate.toLocaleString(
	'en-us',
	{
		year: 'numeric',
		day: 'numeric',
		month: 'short'
	}
);
const [buildDateUtc] = buildDate.toISOString().split('T');

module.exports = {
	formattedBuildDate,
	buildDateUtc
};