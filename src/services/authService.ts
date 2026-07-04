import User, { IUser } from '../models/User';

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResult {
  token: string;
  user: Pick<IUser, '_id' | 'name' | 'email'>;
}

const register = async (input: RegisterInput): Promise<AuthResult> => {
  const user = await User.create(input);
  const token = user.getSignedJwtToken();

  return {
    token,
    user: { _id: user._id, name: user.name, email: user.email },
  };
};

const login = async (input: LoginInput): Promise<AuthResult> => {
  const user = await User.findOne({ email: input.email }).select('+password');
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isMatch = await user.matchPassword(input.password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = user.getSignedJwtToken();

  return {
    token,
    user: { _id: user._id, name: user.name, email: user.email },
  };
};

export { register, login, RegisterInput, LoginInput, AuthResult };
