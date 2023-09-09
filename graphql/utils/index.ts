export const checkObject = (input: Object, data: String) => {
  if (Object.keys(input).length === 0)
    throw new Error(`You need to have at least 1 field to update ${data} data`);
  return;
};
