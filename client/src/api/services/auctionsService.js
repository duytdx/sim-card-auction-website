import { objectToFormData } from "@/utils/apiUtils";
import httpClient from "../httpClient";

export default {
  async addAuction(auction, uploadProgressCallback) {
    const formData = objectToFormData(auction);

    const response = await httpClient.post("/auctions", formData, {
      requiresAuth: true,
      onUploadProgress: uploadProgressCallback,
    });

    return response.data;
  },

  async fetchAuction(auctionId) {
    const response = await httpClient.get(`/auctions/${auctionId}`);

    return response.data;
  },

  async fetchAuctions(page, pageSize, filters) {
    const response = await httpClient.get(`auctions`, {
      params: { page, pageSize, ...filters },
    });
    return response.data;
  },
};
