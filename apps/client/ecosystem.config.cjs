// @ts-check

/**
 * @type {EcosystemConfig}
 */
module.exports = {
	apps: [
		{
			env: {
				/*
				 * biome-ignore lint/style/useNamingConvention: This environment variable
				 * is used internally in Linkcord to resolve the root directory.
				 */
				NODE_ENV: 'production',
			},
			interpreter: 'node',
			name: 'Discord Client',
			script: './dist/index.js',
		},
	],
};

/**
 * @typedef {object} EcosystemConfig
 * @property {import("pm2").StartOptions[]} apps
 */
