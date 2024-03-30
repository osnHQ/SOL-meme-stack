module.exports = {
	env: {
		browser: true,
		amd: true,
		node: true,
	},
	parser: '@typescript-eslint/parser', // Specify the TypeScript parser
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module', // Ensure this is set for ECMAScript modules
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
	],
	plugins: [
		'@typescript-eslint', // Include the TypeScript plugin
	],
	rules: {
		'no-console': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'windows'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
	},
};
