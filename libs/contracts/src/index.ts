export interface HealthResponse {
  status: 'ok';
  service: 'api';
}
export interface ApiErrorBody {
  message: string | string[];
  statusCode: number;
}
