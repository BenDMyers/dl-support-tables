const EleventyFetch = require('@11ty/eleventy-fetch');
const { JSDOM } = require('jsdom');

module.exports = async function() {
	const blogpostUrl = 'https://adrianroselli.com/2022/12/brief-note-on-description-list-support.html';

	const blogpostHtml = await EleventyFetch(blogpostUrl, {
		duration: '1d',
		type: 'text'
	});

	const dom = new JSDOM(blogpostHtml);
	/** @type {HTMLTableSectionElement} */
	const table = dom.window.document.querySelector('#Results ~ [role="region"] table tbody');
	/** @type {HTMLLIElement[]} */
	const footnoteItems = [...dom.window.document.querySelectorAll('#Results ~ ol li')];
	const footnotes = footnoteItems.map(item => item.textContent);

	const [header, ...rows] = table.querySelectorAll('tr');

	/** @type {Object<string, MethodTestRow[]>} */
	const parsed = {};
	for (let row of rows) {
		const rowHeading = row.querySelector('th');
		console.log(rowHeading.innerHTML)
		const [platform, method] = rowHeading
			.innerHTML
			.replace('Safari:<br>', 'Safari')
			.split(':<br>');

		if (!parsed[platform]) {
			/** @type {MethodTestRow[]} */
			parsed[platform] = [];
		}

		const [
			noAriaCell,
			termDefinitionAriaCell,
			associationListAriaCell,
			roundupCell
		] = row.querySelectorAll('td');

		/** @type {MethodTestRow} */
		const methodTestRow = {
			method,
			noAria: parseFinding(noAriaCell, footnotes),
			termDefinitionAria: parseFinding(termDefinitionAriaCell, footnotes),
			associationListAria: parseFinding(associationListAriaCell, footnotes),
			roundup: roundupCell.innerHTML
		};

		parsed[platform].push(methodTestRow);
	}

	console.log(parsed);
	return parsed;
}

/**
 * Parses Adrian's cell into a Finding data structure
 * @param {HTMLTableCellElement} cell scraped cell from Adrian's article
 * @param {string[]} footnotes scraped footnotes list
 * @returns {Finding}
 */
function parseFinding(cell, footnotes) {
	const superscript = cell.querySelector('sup').textContent || '';
	const linkedFootnoteIndices = superscript
		.split(', ')
		.map(index => (Number.parseInt(index) - 1));
	/** @type {string[]} */
	const linkedFootnotes = [];
	for (index of linkedFootnoteIndices) {
		console.log({index})
		linkedFootnotes.push(footnotes[index]);
	}
	
	const [verdict] = cell.innerHTML.split(' <sup>');

	/** @type {Finding} */
	const finding = {
		footnotes: linkedFootnotes,
		verdict,
		verdictClass: [...cell.classList][0]
	};

	return finding;
}

/**
 * @typedef {object} Finding
 * @property {'Yup' | 'Sure' | 'Wut' | 'Nope'} verdict Adrian's recommendation on whether this behavior is sufficient
 * @property {'good' | 'fine' | 'caution' | 'buggy'} verdictClass Adrian's classname for the associated verdict
 * @property {string[]} footnotes associated footnotes that expound upon the verdict
 */

/**
 * @typedef {object} MethodTestRow
 * @property {string} method name of navigation method used for tests
 * @property {Finding} noAria results of given method when no ARIA roles are applied to the `<dl>`
 * @property {Finding} termDefinitionAria results of given method when ARIA 1.1 term/definition roles are applied to the `<dl>`
 * @property {Finding} associationListAria results of given method when ARIA 1.3 association list roles are applied to the `<dl>`
 * @property {string} roundup summary of findings across tests
 */