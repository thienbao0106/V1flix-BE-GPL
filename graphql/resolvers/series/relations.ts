import Series from "../../../models/series";

export const relations = {
  addRelation: async ({
    relationInput: { idSeries, idRelatedSeries, role },
  }: any) => {
    try {
      const series = await Series.findByIdAndUpdate(idSeries, {
        $addToSet: {
          relation: {
            role,
            related_series: idRelatedSeries,
          },
        },
      });
      if (!series) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
};
