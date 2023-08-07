// import { RESPONSE_MESSAGES } from './constant.message';
export function getResponseMessage(success, data, message) {
  return {
    success,
    data,
    message,
  };
}

export function errorResponse(success, message) {
  return {
    success,
    message,
  };
}
