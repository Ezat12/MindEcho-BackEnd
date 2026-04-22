export interface ITokenProvider {
  generateToken: (payload: object) => string;
}
