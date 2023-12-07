import { findSeries } from "./../utils/series";
import bcrypt from "bcryptjs";
import User from "../../models/user";
import jwt from "jsonwebtoken";

type LoginData = {
  email: String;
  password: any;
};

export const userResolvers = {
  //GraphQL also gets request
  users: async (args: any, req: any) => {
    try {
      // if (!req.isAuth) throw new Error("Unauthenticated");
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

      const salt: any = process.env.SALT_GEN;
      console.log(salt);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        username,
        password: hashedPassword,
        list: [],
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
      const jwtKey: any = process.env.HASH_KEYWORD;
      const token = jwt.sign({ userId: user.id, email: user.email }, jwtKey, {
        expiresIn: "1h",
      });
      return {
        ...user._doc,
        password: null,
        userId: user.id,
        token,
        tokenExpiration: 1,
      };
    } catch (error) {
      throw error;
    }
  },
  addSeriesToList: async ({ userListInput, userId }: any) => {
    try {
      const user: any = await User.findById(userId);
      console.log(userListInput);
      user.list.push({ ...userListInput, series: userListInput.seriesId });
      user.save();
      return {
        ...user._doc,
        _id: user.id,
        password: null,
        list: user.list.map((item: any) => {
          console.log(item.id);
          return {
            ...item,

            series: findSeries(item.series),
          };
        }),
      };
    } catch (error) {
      throw error;
    }
  },
  removeSeriesFromList: async ({ seriesId, userId }: any) => {
    try {
      const user: any = await User.findById(userId);
      user.list = [...user.list].filter((item) => item.series._id === seriesId);
      user.save();
      return true;
    } catch (error) {
      throw error;
    }
  },
  removeUser: async ({ userId }: any) => {
    try {
      await User.findByIdAndDelete(userId);
      return true;
    } catch (error) {
      throw error;
    }
  },
  findUserByName: async ({ username }: any) => {
    try {
      const user: any = await User.findOne({
        username,
      });
      console.log(user);
      return {
        ...user._doc,
        _id: user.id,
        password: null,
      };
    } catch (error) {
      throw error;
    }
  },
};
