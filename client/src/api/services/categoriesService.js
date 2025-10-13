import httpClient from "../httpClient";

export default {
  async fetchCategories() {
    const response = await httpClient.get("/categories");
    return response.data;
  },

  async fetchCategory(id) {
    const response = await httpClient.get(`/categories/${id}`);
    return response.data;
  },
};
