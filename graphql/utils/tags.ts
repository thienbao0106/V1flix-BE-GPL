import Tags from "../../models/tags";
import { findMultipleSeries, findSeries } from "./series";

export const transformTags = (tag: any) => {
  return {
    ...tag.tag,
    _id: tag.id,
    series: findMultipleSeries.bind(this, tag.series),
  };
};

export const getTagsId = async (tags: any) => {
  if (!tags || tags.length === 0) return [];
  const tagsArr = tags.map((tag: any) => tag.name);
  const result = await Tags.find({ name: { $in: tagsArr } });
  return result.map((item) => item._id);
};

export const addSeriesToTag = (tagArr: any, seriesId: string) => {
  try {
    tagArr.map(async (tagId: any) => {
      const tag = await Tags.findByIdAndUpdate(
        tagId,
        { $addToSet: { series: seriesId } },
        { new: true }
      );
      if (!tag) throw Error("Can't add this tag" + tagId);
      return;
    });
  } catch (error) {
    throw error;
  }
};

export const findTags = async (tagsArr: any) => {
  try {
    const result = await Tags.find({ _id: { $in: tagsArr } });
    return result.map((tag: any) => {
      return {
        ...tag._doc,
        _id: tag.id,
        series: findSeries.bind(this, tag.series),
      };
    });
  } catch (error) {
    throw error;
  }
};
