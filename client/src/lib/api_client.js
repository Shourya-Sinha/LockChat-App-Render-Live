import axios from "axios";
import { HOST } from "@/Utils/Constant";

export const apiClient = axios.create({
  baseURL: HOST,
});
