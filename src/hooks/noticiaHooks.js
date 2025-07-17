import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, queryClient } from "../services"

export const useBuscarNoticias = () => {
    return useQuery({
        queryKey: ["noticias"],
        queryFn: async () => {
            const res = await AXIOS.get("/noticias");
            return res.data;
        }
    })
}

export const useCriarNoticia = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/noticias", dados, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["noticias"]
            });
        }
    })
}

export const useEditarNoticia = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/noticias/${dados.noticia_id}`, dados, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["noticias"]
            });
        }
    })
}

export const useDeletarNoticia = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/noticias/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["noticias"]
            });
        }
    })
}