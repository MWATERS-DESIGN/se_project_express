const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = {
  JWT_SECRET: NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
  PORT: process.env.PORT || 3001,
};
