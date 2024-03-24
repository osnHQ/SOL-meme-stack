module.exports = {
	env: {
		browser: true,
		amd: true,
		node: true, // Add this line to specify the Node.js environment
	},
	parserOptions: {
		ecmaVersion: 6,
	},
	extends: 'eslint:recommended',
	rules: {
		'no-console': 'off',
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'windows'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
	},
};
