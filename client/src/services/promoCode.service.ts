import { axiosPrivate } from "~/axiosAuth";
export interface IPromoCode {
  _id: string;
  code: string;
  description?: string;
  discountPercent: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  usageLimit: number;
  usedCount: number;
  applicableOrderTypes: string[];
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdBy?: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}
export interface IPromoCodePayload {
  code: string;
  description?: string;
  discountPercent: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  usageLimit?: number;
  applicableOrderTypes?: string[];
  validFrom: string;
  validUntil: string;
  isActive?: boolean;
}
export interface IValidatePromoResponse {
  code: string;
  discountPercent: number;
  discountAmount: number;
  originalPrice: number;
  finalPrice: number;
  maxDiscount?: number;
}
export const promoCodeService = {
  getPromoCodes: async (params?: URLSearchParams) => {
    const queryString = params ? `?${params.toString()}` : "";
    const response = await axiosPrivate.get(`/admin/promo-codes${queryString}`);
    return response.data;
  },
  getPromoCodeById: async (id: string) => {
    const response = await axiosPrivate.get(`/admin/promo-codes/${id}`);
    return response.data;
  },
  createPromoCode: async (payload: IPromoCodePayload) => {
    const response = await axiosPrivate.post("/admin/promo-codes", payload);
    return response.data;
  },
  updatePromoCode: async (id: string, payload: Partial<IPromoCodePayload>) => {
    const response = await axiosPrivate.put(
      `/admin/promo-codes/${id}`,
      payload,
    );
    return response.data;
  },
  deletePromoCode: async (id: string) => {
    const response = await axiosPrivate.delete(`/admin/promo-codes/${id}`);
    return response.data;
  },
  validatePromoCode: async (
    code: string,
    orderType: string,
    orderAmount: number,
  ) => {
    const response = await axiosPrivate.post("/order/validate-promo", {
      code,
      orderType,
      orderAmount,
    });
    return response.data;
  },
};
