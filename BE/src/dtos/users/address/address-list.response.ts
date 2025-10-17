import z from "zod";

export interface AddressListResponse {
  user_id: string;
  addresses: {
    id: number;
    province: string;
    ward: string;
    detail: string;
  }[];
};
