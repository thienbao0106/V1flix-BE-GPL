export const fetchSource = async (id: string, accessToken: string) => {
  const headers: any = {
    method: "GET",
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
    throw new Error(error);
  }
};
