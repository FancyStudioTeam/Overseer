// @ts-check

/**
 * @type {EcosystemConfig}
 */
module.exports = {
	apps: [
		{
			env: {
				NODE_ENV: "production",
			},
			interpreter: "node",
			name: "Discord Client",
			script: "./dist/index.js",
		},
	],
};

/**
 * @typedef {Object} EcosystemConfig
 * @property {import("pm2").StartOptions[]} apps
 */
