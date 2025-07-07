// ecosystem.config.js (Production)
module.exports = {
  apps: [
    {
      name: "the-wedding-lab",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3003",
      interpreter: "/root/.nvm/versions/node/v22.17.0/bin/node",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
