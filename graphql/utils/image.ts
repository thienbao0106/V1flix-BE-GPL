import Image from "../../models/image";
import { findSeries } from "./series";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const transferImagesArr = (imagesObj: any) => {
  console.log(imagesObj);
  return [
    {
      name: `${imagesObj.titleSeries}_banner`,
      series: imagesObj.seriesId,
      type: "banner",
      source: imagesObj.bannerUrl,
    },
    {
      name: `${imagesObj.titleSeries}_cover`,
      series: imagesObj.seriesId,
      type: "cover",
      source: imagesObj.coverUrl,
    },
    {
      name: `${imagesObj.titleSeries}_thumbnail`,
      series: imagesObj.seriesId,
      type: "thumbnail",
      source: imagesObj.thumbnailUrl,
    },
  ].filter((item) => {
    return item.source !== "";
  });
};

export const transformImage = (image: any) => {
  return {
    ...image._doc,
    _id: image.id,
    series: findSeries(image._doc.series),
  };
};

export const findImages = async (imagesId: []): Promise<any> => {
  try {
    const result = await Image.find({ _id: { $in: imagesId } });
    return result.map((image: any) => {
      return transformImage(image);
    });
  } catch (error) {
    throw error;
  }
};

export const uploadToCloudinary = async (
  url: string,
  kind: string,
  title: string
): Promise<string> => {
  if (!url || url === "") return "";
  const finalUrl = await cloudinary.uploader
    .upload(url, {
      public_id: `anime-v2/${kind}/${title}_${kind}`,
      upload_preset: process.env.CLOUDINARY_IMAGE_UPLOAD,
    })
    .then((result: any) => {
      return result.url;
    });
  return finalUrl;
};
