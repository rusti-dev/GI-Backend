import { ResponseMessage } from '../interfaces/response-message.interface';

export const responseHandler = (responseOptions: ResponseMessage): ResponseMessage => {
  const { message, error, statusCode = 500, data, countData } = responseOptions;
  const response: ResponseMessage = {
    statusCode,
    data,
    countData,
    message,
    error,
  };
  return response;
};
