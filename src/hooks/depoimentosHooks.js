import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, queryClient } from "../services"

export const useBuscarDepoimentos = () => {
    return useQuery({
        queryKey: ["depoimentos"],
        queryFn: async () => {
            const res = await AXIOS.get("/depoimentos");
            return res.data;
        }
    })
}

export const useCriarDepoimento = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/depoimentos", dados, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["depoimentos"]
            });
        }
    })
}

export const useEditarDepoimento = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/depoimentos/${dados.depoimento_id}`, dados, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["depoimentos"]
            });
        }
    })
}

export const useDeletarDepoimento = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/depoimentos/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["depoimentos"]
            });
        }
    })
}