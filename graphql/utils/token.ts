export const transferToken = (token: any) => {
  return {
    ...token._doc,
    _id: token.id,
  };
};
