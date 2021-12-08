export default interface customError extends Error {
  code: number;
  status?: number;
  data: any;
}
