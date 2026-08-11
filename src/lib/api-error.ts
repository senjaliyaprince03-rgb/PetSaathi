export type ApiErrorResponse = {
  success: false;
  error: string;
  code: string;
  statusCode: number;
  details?: unknown;
};

export function createApiError(
  error: string,
  code: string,
  statusCode: number = 400,
  details?: unknown
): ApiErrorResponse {
  return {
    success: false,
    error,
    code,
    statusCode,
    ...(details && { details }),
  };
}

export function handleApiError(error: unknown) {
  console.error('[API Error]', error);
  return Response.json(
    createApiError(
      "An unexpected error occurred.",
      "internal_server_error",
      500,
      process.env.NODE_ENV === "development" ? (error as Error).message : undefined
    ),
    { status: 500 }
  );
}
