import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, queryClient } from "../services"

export const useBuscarCategorias = () => {
    return useQuery({
        queryKey: ["categorias"],
        queryFn: async () => {
            const res = await AXIOS.get("/categorias");
            return res.data;
        }
    })
}

export const useCriarCategoria = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/categorias", dados);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categorias"]
            });
        }
    })
}

export const useEditarCategoria = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/categorias/${dados.categoria_id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categorias"]
            });
        }
    })
}

export const useDeletarCategoria = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/categorias/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categorias"]
            });
        }
    })
}