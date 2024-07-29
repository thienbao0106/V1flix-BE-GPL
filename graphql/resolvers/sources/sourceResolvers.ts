import Episode from "../../../models/episode";
import Series from "../../../models/series";
import Source from "../../../models/source";
import { transferSource } from "../../utils/source";

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
  deleteMultipleSource: async ({ seriesId, type }: any) => {
    try {
      const series = await Series.findById(seriesId);
      if (!series) throw new Error("Can't find the series");
      series.episodes.map(async (ep: any, index: number) => {
        const epSource: any = await Episode.findById(ep);
        if (type === "source") {
          await Source.deleteMany({
            _id: {
              $in: epSource.source,
            },
          });
          await Episode.findByIdAndUpdate(epSource.id, {
            source: [],
          });
        }

        if (type === "subtitles") {
          const sourceIds = epSource.subtitles.map((sub: any) => sub._id);
          await Episode.deleteMany({
            _id: {
              $in: sourceIds,
            },
          });
          await Episode.findByIdAndUpdate(epSource.id, {
            subtitles: [],
          });
        }

        return true;
      });
    } catch (error) {
      throw error;
    }
  },
  createMultipleSource: async ({
    seriesId,
    type,
    lang,
    kind,
    sourceList,
  }: any) => {
    try {
      const date = Date.parse(new Date().toLocaleString());
      const series: any = await Series.findById(seriesId);
      if (!series) throw new Error("Can't find this series");

      series.episodes.map(async (ep: any, index: number) => {
        const epSource: any = await Episode.findById(ep);

        if (!sourceList[index]) return;
        const source = new Source({
          kind,
          value: sourceList[index],
          created_at: date,
          updated_at: date,
        });

        await source.save();
        const sourceId = source._id || source.id;

        let updatedProperty: any = {};
        if (type === "subtitles") {
          if (!lang) throw new Error("Can't add this subtitle's source");
          console.log(epSource[type]);
          const langSource = epSource[type].find(
            (sub: any) => sub.lang === lang
          );
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
          epSource.id,
          updatedProperty
        );
        if (isUpdated) return transferSource(source);
        throw new Error("Can't update source!");
      });
    } catch (error) {
      throw error;
    }
  },
  createSource: async ({ sourceInput, episodeId, type, lang }: any) => {
    //Type is source and subtitles
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
      const sourceId = source._id || source.id;
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
        epSource.id,
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
