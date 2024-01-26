type TErrorResponse = {
  success: false;
  statusCode?: number;
  message: string;
  errorMessage: string;
  errorDetails: object | null;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  data?: any;
  stack?: any;
};

export default TErrorResponse;
