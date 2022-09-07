const {
  NODE_ENV, JWT_SECRET, PORT, DB,
} = process.env;

const port = PORT || 3000;
const db = DB || 'mongodb://localhost:27017/moviesdb';
const jwtSecret = NODE_ENV === 'production' ? JWT_SECRET : 'arelisivx';

module.exports = {
  port,
  db,
  jwtSecret,
};
