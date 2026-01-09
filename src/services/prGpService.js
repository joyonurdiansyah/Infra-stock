import apiClient from "./apiClient";

export const fetchPrGp = async (payload) => {
  const response = await apiClient.post("/gp/pr/", {
    Departement: payload.Departement,
    PR_Desc: payload.PR_Desc,
  });

  return response.data;
};
