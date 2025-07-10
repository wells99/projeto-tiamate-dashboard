import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, queryClient } from "../services"

export const useBuscarRedes = () => {
    return useQuery({
        queryKey: ["redes"],
        queryFn: async () => {
            const res = await AXIOS.get("/redes");
            return res.data;
        }
    })
}

export const useCriarRede = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/redes", dados);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["redes"]
            });
        }
    })
}

export const useEditarRede = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/redes/${dados.rede_id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["redes"]
            });
        }
    })
}

export const useDeletarRede = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/redes/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["redes"]
            });
        }
    })
}