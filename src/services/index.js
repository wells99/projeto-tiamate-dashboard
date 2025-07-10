import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const AXIOS = axios.create({
    // baseURL: "http://localhost:3000"
    baseURL: "https://projeto-tiamate-back.onrender.com"
})

export const queryClient = new QueryClient();