import Series from "../../../models/series";
import User from "../../../models/user";

export const favoriteSeries = {
  addFavoriteSeries: async ({ userId, seriesId }: any) => {
    try {
      const user: any = await User.findById(userId);
      const series: any = await Series.findById(seriesId);
      if (!user || !series) return false;
      const isDuplicate = user.favoriteList.find(
        (series: any) => series._id == seriesId
      );
      if (isDuplicate) return false;
      user.favoriteList.push(series);
      series.favors = series.favors + 1;
      await user.save();
      await series.save();
      return true;
    } catch (error) {
      throw error;
    }
  },
  deleteFavoriteSeries: async ({ userId, seriesId }: any) => {
    try {
      const user: any = await User.findById(userId);
      const series: any = await Series.findById(seriesId);
      if (!user || !series) return false;
      user.favoriteList = [...user.favoriteList].filter(
        (series) => series._id != seriesId
      );
      series.favors = series.favors - 1;
      await user.save();
      await series.save();
      return true;
    } catch (error) {
      throw error;
    }
  },
};
