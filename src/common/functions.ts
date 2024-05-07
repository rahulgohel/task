export const getCommonResponse = (
  status: number,
  message: string,
  data: any | null,
) => {
  return {
    status,
    message,
    data,
  };
};
export const getRandomNumber = (length: number) => {
  var result = '';
  var characters =
    '0123456789012345678901234567890123456789012345678901234567890123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
