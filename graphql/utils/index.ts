export const checkObject = (input: Object, data: String) => {
  if (Object.keys(input).length === 0)
    throw new Error(`You need to have at least 1 field to update ${data} data`);
  return;
};

export const paginateResult = async (
  model: any,
  pageNumber: number,
  limitPerPage: number
) => {
  let result: any;
  if (!pageNumber || !limitPerPage) result = await model.find();
  result = await model
    .find()
    .limit(limitPerPage)
    .skip(limitPerPage * pageNumber);
  const totalPage = Math.ceil((await model.count()) / limitPerPage);
  return { result, totalPage };
};
