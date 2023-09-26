import 'dotenv/config';

export default {
  mode: process.env.NODE_ENV,
  host: process.env.HOST,
  port: process.env.PORT,
};
