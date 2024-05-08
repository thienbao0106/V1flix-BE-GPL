import User from "../../../models/user";
import {
  calculateDaysWatched,
  modifyList,
  sumMeanScore,
  sumTotalEpisodes,
  transformUsers,
} from "../../utils/user";

export const listSeries = {
  addSeriesToList: async ({
    seriesId,
    note,
    currentEp,
    status,
    userId,
  }: any) => {
    try {
      const user: any = await User.findById(userId);
      const userListInput = {
        seriesId,
        note,
        currentEp,
        status,
      };
      user.list.push({ ...userListInput, series: userListInput.seriesId });
      const modifiedList = await modifyList(user.list);
      user.stats.total_episodes = sumTotalEpisodes(user.list);
      user.stats.days_watched = calculateDaysWatched(modifiedList);

      user.stats.mean_score = await sumMeanScore(modifiedList, userId, false);
      user.save();
      return {
        ...transformUsers(user),
        list: modifiedList,
      };
    } catch (error) {
      throw error;
    }
  },
  removeSeriesFromList: async ({ seriesId, userId }: any) => {
    try {
      const user: any = await User.findById(userId);
      user.list = [...user.list].filter((item) => {
        return item.series != seriesId;
      });
      const modifiedList = await modifyList(user.list);
      user.stats.total_episodes = sumTotalEpisodes(user.list);
      user.stats.days_watched = calculateDaysWatched(modifiedList);
      user.stats.mean_score = await sumMeanScore(modifiedList, userId, false);
      user.save();
      return true;
    } catch (error) {
      throw error;
    }
  },
  updateSeriesInList: async ({
    seriesId,
    note,
    currentEp,
    status,
    userId,
  }: any) => {
    const user: any = await User.findById(userId);
    const userListInput = {
      seriesId,
      note,
      currentEp,
      status,
    };
    user.list = [...user.list].filter((item) => {
      return item.series != seriesId;
    });
    user.list.push({ ...userListInput, series: userListInput.seriesId });
    const modifiedList = await modifyList(user.list);
    user.stats.total_episodes = sumTotalEpisodes(user.list);
    user.stats.days_watched = calculateDaysWatched(modifiedList);
    user.stats.mean_score = await sumMeanScore(modifiedList, userId, false);

    user.save();
    return true;
  },
};
