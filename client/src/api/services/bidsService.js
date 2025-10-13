import httpClient from "../httpClient";

export default {
  async fetchAuctionBids(auctionId, page, pageSize) {
    const response = await httpClient.get(`auctions/${auctionId}/bids`, {
      params: {
        page,
        pageSize,
      },
    });
    return response.data;
  },

  async fetchAcceptedBid(auctionId) {
    const response = await httpClient.get(
      `auctions/${auctionId}/bids/accepted-bid`
    );
    return response.data;
  },
};
