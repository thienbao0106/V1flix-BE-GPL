import Source from "../../models/source";
import { fetchGGDriveSource, fetchOneDriveSource } from "./drive";

export const transferSource = (source: any) => {
  return {
    ...source._doc,
    _id: source.id,
    value:
      source.kind === "onedrive"
        ? fetchOneDriveSource(source._doc.value)
        : fetchGGDriveSource(source._doc.value),
  };
};

export const transferMultipleSource = async (sourceIds: any[]) => {
  try {
    if (sourceIds.length === 0) return [];
    const result: any = await Source.find({ _id: { $in: sourceIds } });
    return result.map((data: any) => {
      return transferSource(data);
    });
  } catch (err: any) {
    throw err;
  }
};
