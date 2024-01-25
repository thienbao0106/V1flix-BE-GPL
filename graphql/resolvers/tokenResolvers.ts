import Token from "../../models/token.js";
import { transferToken } from "../utils/token.js";

export const tokenResolvers = {
  tokens: async () => {
    try {
      const result = await Token.find();
      return result.map((token: any) => {
        return transferToken(token);
      });
    } catch (error: any) {
      throw new Error(error);
    }
  },
  findToken: async ({ kind }: any) => {
    try {
      const result = await Token.findOne({ kind });
      return transferToken(result);
    } catch (error: any) {
      throw new Error(error);
    }
  },
  createToken: async ({ tokenInput }: any) => {
    try {
      console.log(tokenInput);
      const { kind } = tokenInput;
      const isExisted = await Token.findOne({
        kind,
      });
      if (isExisted) throw new Error("This token is already existed");
      const token = new Token(tokenInput);
      await token.save();
      return transferToken(token);
    } catch (error: any) {
      throw new Error(error);
    }
  },
  editToken: async ({ value, expiresAt, tokenId }: any) => {
    try {
      if (value === "" || expiresAt <= 0)
        throw new Error("Please check your input again");
      const editedToken = await Token.findByIdAndUpdate(tokenId, {
        value,
        expiresAt,
      });
      return transferToken(editedToken);
    } catch (error: any) {
      throw new Error(error);
    }
  },
  deleteToken: async ({ tokenId }: any) => {
    try {
      const isDeleted = await Token.findByIdAndDelete(tokenId);
      if (isDeleted) return true;
      return false;
    } catch (error: any) {
      throw new Error(error);
    }
  },
};
