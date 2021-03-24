export interface PayloadAccessJwt {
  id: number;
};

export interface PayloadRefreshJwt {
  token: string;
  id: number;
};