// ecosystem.config.js (Production)
module.exports = {
  apps: [
    {
      name: "the-wedding-lab",
      script: "node_modules/next/dist/bin/next",
      args: "start -- -p 3003",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
