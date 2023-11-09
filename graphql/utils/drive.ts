export const fetchOneDriveSource = async (id: string, accessToken: string) => {
  const headers: any = {
    method: "GET",
    signal: AbortSignal.timeout(5000),
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  };
  try {
    const result = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/items/${id}/content`,
      headers
    );
    console.log(result);
    if (!result.ok) throw new Error("Error while handling fetching");
    return result.url;
  } catch (error: any) {
    console.error(error);
    return id;
  }
};

export const fetchGGDriveSource = (id: string) => {
  return `https://www.googleapis.com/drive/v3/files/${id}?key=${process.env.GGDRIVE_KEY}&alt=media`;
};
