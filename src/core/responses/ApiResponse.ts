export default class ApiResponse<T = unknown> {
  constructor(
    public success: boolean,
    public message: string,
    public data?: T
  ) {}

  static success<T>(
    data: T,
    message = "Success"
  ): ApiResponse<T> {
    return new ApiResponse(true, message, data);
  }

  static failure(
    message = "Something went wrong"
  ): ApiResponse<null> {
    return new ApiResponse(false, message, null);
  }
}