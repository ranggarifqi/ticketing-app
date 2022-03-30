export interface ErrorProps {
  message: string;
  field?: string;
}
export interface ErrorResponse {
  errors: ErrorProps[];
}
