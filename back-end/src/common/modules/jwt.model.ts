export interface PayloadAccessJwt {
  id: number;
};

export interface PayloadRefreshJwt {
  token: string;
  user: number;
};