// ecosystem.config.js (development)
module.exports = {
  apps: [
    {
      name: "the-wedding-lab-dev",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3004",
      interpreter: "/root/.nvm/versions/node/v22.17.0/bin/node",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
