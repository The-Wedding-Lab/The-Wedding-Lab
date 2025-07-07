// ecosystem.config.js (development)
module.exports = {
  apps: [
    {
      name: "the-wedding-lab-dev",
      script: "node_modules/next/dist/bin/next",
      args: "start -- -p 3004",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
