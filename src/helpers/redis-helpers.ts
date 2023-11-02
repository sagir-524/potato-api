import { redis } from "../redis"

export const batchDelete = async (pattern: string) => {
  const keys = await redis.keys(pattern);
  const pipeline = redis.pipeline();
  keys.forEach(key => pipeline.del(key));
  return pipeline.exec();
}