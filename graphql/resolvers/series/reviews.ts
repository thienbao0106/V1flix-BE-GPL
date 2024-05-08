import Series from "../../../models/series";
import { findUserById } from "../../utils/user";

export const reviews = {
  addReview: async ({ seriesId, userId, review, spoilerFree }: any) => {
    try {
      const date = Date.parse(new Date().toLocaleString());
      const newReview = {
        user: userId,
        review,
        created_at: date,
        updated_at: date,
      };
      const isExisted: any = await Series.findOne({
        _id: seriesId,
        "reviews.user": userId,
      });
      console.log(isExisted);
      if (isExisted) throw new Error("This user has already reviewed");
      const reviews: any = await Series.findByIdAndUpdate(
        seriesId,
        {
          $push: {
            reviews: {
              review,
              user: userId,
              spoiler_free: spoilerFree,
            },
          },
        },
        { returnDocument: "after" }
      );

      if (!reviews) throw new Error("Can't add review for this series");

      const id: any = reviews.reviews[reviews.reviews.length - 1]?._id;
      return {
        _id: id,
        ...newReview,
        user: findUserById(userId),
      };
    } catch (error) {
      throw error;
    }
  },
  deleteReview: async ({ seriesId, reviewId }: any) => {
    try {
      const reviews: any = await Series.findByIdAndUpdate(seriesId, {
        $pull: {
          reviews: {
            _id: reviewId,
          },
        },
      });
      if (!reviews) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
  editReview: async ({ seriesId, reviewId, review, spoilerFree }: any) => {
    try {
      const date = Date.parse(new Date().toLocaleString());
      const reviews: any = await Series.findOneAndUpdate(
        {
          _id: seriesId,
          "reviews._id": reviewId,
        },
        {
          $set: {
            "reviews.$.review": review,
            "reviews.$.updated_at": date,
            "reviews.$.spoiler_free": spoilerFree,
          },
        }
      );
      console.log(reviews.reviews);
      if (!reviews) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
};
