import bcrypt from "bcrypt";
import User from "../../models/user";
import jwt from "jsonwebtoken";

type LoginData = {
  email: String;
  password: any;
};

export const userResolvers = {
  users: async () => {
    try {
      const result = await User.find();
      return result.map((user: any) => {
        return {
          ...user._doc,
          _id: user.id,
          password: null,
        };
      });
    } catch (error: any) {
      throw error;
    }
  },
  createUser: async (args: any) => {
    try {
      const { username, password, email } = args.userInput;
      const isExisted = await User.find({ $or: [{ username }, { email }] });

      if (isExisted.length > 0)
        throw new Error("This account is already existed");

      const hashedPassword = await bcrypt.hash(password, 4);
      const user = new User({
        email,
        username,
        password: hashedPassword,
      });

      const result: any = await user.save();
      return {
        ...result._doc,
        _id: result.id,
      };
    } catch (error: any) {
      throw error;
    }
  },
  login: async ({ email, password }: LoginData) => {
    try {
      const user: any = await User.findOne({ email });
      if (!user) throw new Error("Can't find this user");
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) throw new Error("Password is not correct");
      const token = jwt.sign({ userId: user.id, email: user.email }, "v1sion", {
        expiresIn: "1h",
      });
      return {
        userId: user.id,
        token,
        tokenExpiration: 1,
      };
    } catch (error) {
      throw error;
    }
  },
};
