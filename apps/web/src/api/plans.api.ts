import { api } from "./axios";


export async function getPlans(){

  const response = await api.get(
    "/subscription/plans"
  );

  return response.data;

}