export interface ITokenProvider {
  generateAccessToken: (payload: object) => string;
  generateRefreshToken: (payload: object) => string;
}
