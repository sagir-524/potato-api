import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});

client
  .on("connect", () => console.log("Redis server connectioned"))
  .on("error", () => console.log("Error occured in redis server"));

export const redis = client;
