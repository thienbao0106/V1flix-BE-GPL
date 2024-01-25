import Series from "../../models/series.js";
import Tags from "../../models/tags.js";
import { getALTags, getALTagsShow } from "../utils/anilist.js";
import { addSeriesToTag, getTagsId, transformTags } from "../utils/tags.js";

export const tagsResolvers = {
  tags: async () => {
    try {
      const tags = await Tags.find();
      return tags.map((tag: any) => {
        return transformTags(tag);
      });
    } catch (error) {
      throw error;
    }
  },
  findTagsById: async ({ tagId }: any) => {
    try {
      const tag = await Tags.findById(tagId);
      return transformTags(tag);
    } catch (error) {
      throw error;
    }
  },
  deleteAllTags: async () => {
    try {
      const result = await Tags.deleteMany();
      if (!result) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
  addTagsByAnilist: async () => {
    try {
      const list = await getALTags();
      console.log(list);
      if (!list) return false;
      const result = await Tags.insertMany(list, {
        ordered: true,
      });
      if (!result) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
  fillTags: async ({ seriesId, anilistId }: any) => {
    try {
      const tags = await getALTagsShow(anilistId);
      const tagsIdArr = await getTagsId(tags);
      console.log(tagsIdArr);
      addSeriesToTag(tagsIdArr, seriesId);
      const result = await Series.findByIdAndUpdate(seriesId, {
        tags: tagsIdArr,
      });
      if (!result) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
};
