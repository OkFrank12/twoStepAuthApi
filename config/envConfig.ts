import env from "dotenv";
env.config();

export const envConfig = {
  PORT: process.env.PORT!,
  MONGO_CONNECT: process.env.MONGO_CONNECT!,
  TOKEN: process.env.TOKEN_SECRET!,
  G_ID: process.env.G_ID!,
  G_SECRET: process.env.G_SECRET!,
  G_REFRESH: process.env.G_REFRESH!,
  G_URL: process.env.G_URL!,
};
