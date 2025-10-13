import httpClient from "../httpClient";

export default {
  async fetchCities() {
    const response = await httpClient.get("/cities");
    return response.data;
  },
};
