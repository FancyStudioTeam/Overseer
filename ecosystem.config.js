module.exports = {
  apps: [
    {
      name: "Fancycord",
      script: "./dist/src/index.js",
      env_production: {
        NODE_ENV: "PRODUCTION",
      },
      env_development: {
        NODE_ENV: "DEVELOPMENT",
      },
      max_memory_restart: "750MB",
    },
  ],
};
