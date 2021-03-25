export interface PayloadAccessJwt {
  userId: number;
};

export interface PayloadRefreshJwt {
  token: string;
  id: number;
};