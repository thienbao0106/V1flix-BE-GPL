import User from "../../models/user";
import { findSeries } from "./series";

const SERIES_TYPE: any = {
  movie: 90,
  tv: 24,
};

export const transformUsers = (user: any) => {
  return {
    ...user._doc,
    _id: user.id || user._id,
    password: null,
  };
};

export const findUserById = async (userId: any) => {
  try {
    const user = await User.findById(userId);
    return transformUsers(user);
  } catch (error) {
    throw error;
  }
};

export const sumTotalEpisodes = (userList: any) => {
  const episodesArr = userList.map((series: any) => {
    if (series.status === "plans to watch") return 0;
    return series.currentEp;
  });
  return episodesArr.reduce(
    (total: number, current: number) => total + current
  );
};

//Bad function
export const sumMeanScore = async (
  userList: any,
  userId: any,
  isAdd: boolean
) => {
  const episodesArr = await Promise.all(
    userList.map(async (series: any) => {
      const ratings = await Promise.all(series.series.rating);
      return ratings.find((rating: any) => {
        return rating.user._id === userId;
      }).score;
    })
  );
  const divided = isAdd ? episodesArr.length + 1 : episodesArr.length;
  const result =
    episodesArr.reduce((total: number, current: number) => total + current) /
    divided;

  return parseFloat(result.toFixed(2));
};

export const calculateDaysWatched = (userList: any) => {
  const daysArr = userList.map((series: any) => {
    if (series.status === "plans to watch") return 0;

    const { type } = series.series;
    return series.currentEp * SERIES_TYPE[type.toLowerCase()];
  });
  const totalMinutes: number = daysArr.reduce(
    (total: number, current: number) => total + current
  );
  return Math.round((totalMinutes / 3600) * 10) / 10;
};

export const modifyList = async (userList: any) => {
  return await Promise.all(
    userList.map(async (item: any) => {
      const series = await findSeries(item.series);
      return { ...item._doc, series };
    })
  );
};
