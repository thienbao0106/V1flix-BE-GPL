import User from "../../../models/user";
import { findMultipleSeries } from "../../utils/series";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { modifyList, transformUsers } from "../../utils/user";
import { listSeries } from "./listSesries";

type LoginData = {
  email: String;
  password: any;
};

export const userResolvers = {
  users: async (args: any, req: any) => {
    try {
      // if (!req.isAuth) throw new Error("Unauthenticated");
      const result = await User.find();
      return result.map((user: any) => {
        return transformUsers(user);
      });
    } catch (error: any) {
      throw error;
    }
  },
  createUser: async ({ username, password, email }: any) => {
    try {
      const isExisted = await User.find({ $or: [{ username }, { email }] });
      if (isExisted.length > 0)
        throw new Error("This account is already existed");

      const salt: any = process.env.SALT_GEN;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        username,
        password: hashedPassword,
        list: [],
        avatar: "",
        favors: 0,
      });
      await user.save();
      return transformUsers(user);
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
        userId: user.id,
        token,
      };
    } catch (error) {
      throw error;
    }
  },
  updateProfile: async ({ email, username, password, avatar, userId }: any) => {
    try {
      const isExisted = await User.find({
        $or: [
          {
            username,
          },
          {
            email,
          },
        ],
      });

      if (isExisted.length !== 0)
        throw new Error("This username or email already claimed");

      const result: any = await User.findByIdAndUpdate(userId, {
        email,
        username,
        password,
        avatar,
      });
      if (!result) return false;
      console.log(result);
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
      console.log(user.list);
      const modifiedList = await modifyList(user.list);
      const modifiedFavoriteList = await findMultipleSeries(user.favoriteList);

      return {
        ...transformUsers(user),
        list: modifiedList,
        favoriteList: modifiedFavoriteList,
      };
    } catch (error) {
      throw error;
    }
  },
  findUsers: async ({ username }: any) => {
    const users: any = await User.find({
      username: {
        $regex: username,
        $options: "i",
      },
    });
    return users.map(async (user: any) => {
      const modifiedList = await modifyList(user.list);
      const modifiedFavoriteList = await findMultipleSeries(user.favoriteList);
      return {
        ...transformUsers(user),
        list: modifiedList,
        favoriteList: modifiedFavoriteList,
      };
    });
  },
  ...listSeries,
};
