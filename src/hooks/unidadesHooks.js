import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, queryClient } from "../services"

export const useBuscarUnidades = () => {
    return useQuery({
        queryKey: ["unidades"],
        queryFn: async () => {
            const res = await AXIOS.get("/unidades");
            return res.data;
        }
    })
}

export const useCriarUnidade = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/unidades", dados);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["unidades"]
            });
        }
    })
}

export const useEditarUnidade = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/unidades/${dados.unidade_id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["unidades"]
            });
        }
    })
}

export const useDeletarUnidade = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/unidades/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["unidades"]
            });
        }
    })
}