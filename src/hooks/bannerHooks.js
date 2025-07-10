import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, queryClient } from "../services"

export const useBuscarBanners = () => {
    return useQuery({
        queryKey: ["banners"],
        queryFn: async () => {
            const res = await AXIOS.get("/banners");
            return res.data;
        }
    })
}

export const useCriarBanner = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/banners", dados, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["banners"]
            });
        }
    })
}

export const useEditarBanner = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/banners/${dados.banner_id}`, dados, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["banners"]
            });
        }
    })
}

export const useDeletarBanner = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/banners/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["banners"]
            });
        }
    })
}