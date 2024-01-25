import Episode from "../../models/episode.js";
import Source from "../../models/source.js";
import { transferSource } from "../utils/source.js";

export const sourceResolvers = {
  sources: async () => {
    try {
      const result = await Source.find();
      return result.map((source: any) => {
        return transferSource(source);
      });
    } catch (error: any) {
      throw new Error(error);
    }
  },
  createSource: async ({ sourceInput, episodeId, type, lang }: any) => {
    try {
      const date = Date.parse(new Date().toLocaleString());
      const isExisted = await Source.findOne(sourceInput);
      if (isExisted) throw new Error("This source is duplicated");
      console.log(sourceInput);
      const { kind, value } = sourceInput;
      console.log(sourceInput);
      const source = new Source({
        kind,
        value,
        created_at: date,
        updated_at: date,
      });

      await source.save();
      const sourceId = source._id;
      const epSource: any = await Episode.findById(episodeId);
      let updatedProperty: any = {};
      if (type === "subtitles") {
        if (!lang) throw new Error("Can't add this subtitle's source");
        const langSource = epSource[type].find((sub: any) => sub.lang === lang);
        if (!langSource) throw new Error("Can't find this lang");
        langSource.source.push(sourceId);
        epSource[type] = [...epSource[type]]
          .filter((sub: any) => sub.lang === lang)
          .push(langSource);
      } else {
        epSource[type].push(sourceId);
      }

      updatedProperty[type] = epSource[type];
      const isUpdated = await Episode.findByIdAndUpdate(
        episodeId,
        updatedProperty
      );
      if (isUpdated) return transferSource(source);
      throw new Error("Can't update source!");
    } catch (error: any) {
      throw new Error(error);
    }
  },
  addSourceToEpisode: async ({ sourceId, episodeId, type, lang }: any) => {
    try {
      const epSource: any = await Episode.findById(episodeId);
      let updatedProperty: any = {};
      if (type === "subtitles") {
        if (!lang) throw new Error("Can't add this subtitle's source");
        const langSource = epSource[type].find((sub: any) => sub.lang === lang);
        if (!langSource) throw new Error("Can't find this lang");
        langSource.source.push(sourceId);
        epSource[type] = [...epSource[type]]
          .filter((sub: any) => sub.lang === lang)
          .push(langSource);
      } else {
        epSource[type].push(sourceId);
      }

      updatedProperty[type] = epSource[type];
      const isUpdated = await Episode.findByIdAndUpdate(
        episodeId,
        updatedProperty
      );
      if (isUpdated) return true;
      return false;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  deleteSource: async ({ sourceId, type, episodeId }: any) => {
    try {
      const epSourceDeleted: any = await Episode.findById(episodeId);
      epSourceDeleted[type] = [...epSourceDeleted[type]].filter(
        (source: any) => source._id === sourceId
      );
      let updatedProperty: any = {};
      updatedProperty[type] = epSourceDeleted[type];
      const isDeleted = await Episode.findByIdAndUpdate(
        episodeId,
        updatedProperty
      );
      if (!isDeleted) throw new Error("Can't delete this source");
      const result = await Source.findByIdAndDelete(sourceId);
      if (result) return true;
      return false;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  editSource: async ({ sourceInput, sourceId }: any) => {
    try {
      const date = Date.parse(new Date().toLocaleString());

      const isExisted = await Source.findOne(sourceInput);
      if (isExisted) throw new Error("This source is already existed");
      const updatedSource: any = await Source.findByIdAndUpdate(sourceId, {
        ...sourceInput,
        updated_at: date,
      });
      if (updatedSource) return transferSource(updatedSource);
    } catch (error: any) {
      throw new Error(error);
    }
  },
};
