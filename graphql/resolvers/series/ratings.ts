import { modifyList, sumMeanScore } from "../../utils/user";
import Series from "../../../models/series";
import User from "../../../models/user";

export const ratings = {
  addRating: async ({ userId, seriesId, score }: any) => {
    try {
      const series = await Series.findById(seriesId);
      if (!series) return;
      const found = series.rating.find((rate: any) => rate.user == userId);
      if (!found) series.rating.push({ user: userId, score });
      else {
        const filteredArr = series.rating.filter((rate) => rate.user != userId);
        filteredArr.push({ user: userId, score });
        series.rating = filteredArr;
      }
      //Update user's mean score
      const user: any = await User.findById(userId);
      if (user.list.length <= 1) user.stats.mean_score = score;
      else {
        const modifiedList = await modifyList(user.list);
        console.log("modified list");
        console.log(modifiedList);
        const list = modifiedList.filter(
          (item: any) => item.series._id !== seriesId
        );
        const result =
          (await sumMeanScore(list, userId, true)) + (score / list.length + 1);
        user.stats.mean_score = parseFloat(result.toFixed(2));

        console.log("mean-score");
        console.log(user.stats.mean_score);
      }

      await series.save();
      await user.save();
      return true;
    } catch (error) {
      throw error;
    }
  },
};
