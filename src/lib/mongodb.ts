import mongoose from "mongoose";

import { requireEnv } from "@/config/env";

type MongoConnectionCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongo = globalThis as typeof globalThis & {
  mongoConnectionCache?: MongoConnectionCache;
};

const cache = globalForMongo.mongoConnectionCache ?? {
  connection: null,
  promise: null,
};

if (!globalForMongo.mongoConnectionCache) {
  globalForMongo.mongoConnectionCache = cache;
}

export async function connectMongoDB() {
  if (cache.connection && mongoose.connection.readyState === 1) {
    return cache.connection;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(getMongoDBUri(), {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10_000,
    });
  }

  try {
    cache.connection = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.connection;
}

export function getMongoConnectionState() {
  return mongoose.connection.readyState;
}

function getMongoDBUri() {
  const uri = requireEnv("MONGODB_URI").trim();

  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    throw new Error(
      'Invalid MONGODB_URI. It must start with "mongodb://" or "mongodb+srv://".',
    );
  }

  return uri;
}
