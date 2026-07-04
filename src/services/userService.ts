import User, { IUser } from '../models/User';
import redis from '../config/redis';

const CACHE_TTL = 300; // 5 minutes

const getUsers = async (): Promise<IUser[]> => {
  const cacheKey = 'users:all';
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      // Note: deserialized objects are plain JSON, not full Mongoose documents
      return JSON.parse(cached) as IUser[];
    }
  } catch {
    // Redis unavailable — fall through to database
  }

  const users = await User.find();
  try {
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(users));
  } catch {
    // Redis unavailable — cache is optional
  }
  return users;
};

const getUserById = async (id: string): Promise<IUser | null> => {
  const cacheKey = `user:${id}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      // Note: deserialized object is plain JSON, not a full Mongoose document
      return JSON.parse(cached) as IUser;
    }
  } catch {
    // Redis unavailable — fall through to database
  }

  const user = await User.findById(id);
  if (user) {
    try {
      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(user));
    } catch {
      // Redis unavailable — cache is optional
    }
  }
  return user;
};

const createUser = async (data: Partial<IUser>): Promise<IUser> => {
  const user = await User.create(data);
  try {
    await redis.del('users:all');
  } catch {
    // Redis unavailable — cache invalidation is best-effort
  }
  return user;
};

const updateUser = async (
  id: string,
  data: Partial<IUser>
): Promise<IUser | null> => {
  const user = await User.findById(id);
  if (!user) return null;

  if (data.name !== undefined) user.name = data.name;
  if (data.email !== undefined) user.email = data.email;
  if (data.password !== undefined) user.password = data.password;

  const updated = await user.save();
  try {
    await redis.del('users:all');
    await redis.del(`user:${id}`);
  } catch {
    // Redis unavailable — cache invalidation is best-effort
  }
  return updated;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const user = await User.findByIdAndDelete(id);
  if (user) {
    try {
      await redis.del('users:all');
      await redis.del(`user:${id}`);
    } catch {
      // Redis unavailable — cache invalidation is best-effort
    }
  }
  return user;
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
