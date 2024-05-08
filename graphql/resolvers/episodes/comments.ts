import Episode from "../../../models/episode";
import { findUserById } from "../../utils/user";

export const comments = {
  addComments: async ({ episodeId, userId, content }: any) => {
    try {
      const date = Date.parse(new Date().toLocaleString());
      const newComment: any = {
        user: userId,
        content,
        created_at: date,
        updated_at: date,
      };

      const episode: any = await Episode.findByIdAndUpdate(
        episodeId,
        {
          $push: {
            comments: newComment,
          },
        },
        { returnDocument: "after" }
      );
      if (!episode) throw new Error("Can't add comment");
      const id: any = episode.comments[episode.comments.length - 1]?._id;
      return {
        _id: id,
        ...newComment,
        user: findUserById(userId),
      };
    } catch (error) {
      throw error;
    }
  },
  deleteComment: async ({ episodeId, commentId }: any) => {
    try {
      const episode = await Episode.findByIdAndUpdate(episodeId, {
        $pull: {
          comments: {
            _id: commentId,
          },
        },
      });
      if (!episode) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
  editComment: async ({ episodeId, commentId, content }: any) => {
    try {
      const date = Date.parse(new Date().toLocaleString());
      const episode = await Episode.findOneAndUpdate(
        {
          _id: episodeId,
          "comments._id": commentId,
        },
        {
          $set: {
            "comments.$.content": content,
            "comments.$.updated_at": date,
          },
        }
      );
      if (!episode) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
};
