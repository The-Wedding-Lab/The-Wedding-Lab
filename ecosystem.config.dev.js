// ecosystem.config.js (development)
module.exports = {
  apps: [
    {
      name: "the-wedding-lab-dev",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 3004",
      interpreter: "/root/.nvm/versions/node/v22.17.0/bin/node",
      cwd: "/home/projects/The-Wedding-Lab",
      env: {
        NODE_ENV: "production",
        PORT: "3004",
      },
      instances: 1,
      exec_mode: "fork",
      log_file: "./logs/app.log",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm Z",
    },
  ],
};
