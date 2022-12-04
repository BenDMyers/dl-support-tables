const webc = require('@11ty/eleventy-plugin-webc');

/**
 * @typedef {import('@11ty/eleventy/src/UserConfig')} EleventyConfig
 * @typedef {ReturnType<import('@11ty/eleventy/src/defaultConfig')>} EleventyReturnValue
 * @type {(eleventyConfig: EleventyConfig) => EleventyReturnValue}
 */
module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(webc);
	
	return {
		dir: {
			input: 'src'
		}
	};
};