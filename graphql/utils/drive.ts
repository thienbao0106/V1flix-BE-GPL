import Token from "../../models/token";
import { transferToken } from "./token";

export const fetchOneDriveSource = async (id: string) => {
  const result: any = await Token.findOne({
    kind: "onedrive",
  });
  const accessToken = transferToken(result);

  const headers: any = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken.value,
    },
  };
  try {
    const result = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/items/${id}/content`,
      headers
    );
    console.log("Result after query");
    console.log(result);
    if (result.status !== 200) throw new Error("Error while handling fetching");
    console.log("Success");
    return result.url;
  } catch (error: any) {
    console.error(error);
    return id;
  }
};

export const fetchGGDriveSource = (id: string) => {
  return `https://www.googleapis.com/drive/v3/files/${id}?key=${process.env.GGDRIVE_KEY}&alt=media`;
};
