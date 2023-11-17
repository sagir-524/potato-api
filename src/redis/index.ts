import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const client = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT),
});

client
  .on("connect", () => console.log("Redis server connectioned"))
  .on("error", () => console.log("Error occured in redis server"));

export const redis = client;
