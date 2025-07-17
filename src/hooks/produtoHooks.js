import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, queryClient } from "../services"

export const useBuscarProdutos = () => {
    return useQuery({
        queryKey: ["produtos"],
        queryFn: async () => {
            const res = await AXIOS.get("/produtos");
            return res.data;
        }
    })
}

export const useCriarProduto = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/produtos", dados, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["produtos"]
            });
        }
    })
}

export const useEditarProduto = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/produtos/${dados.produto_id}`, dados, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["produtos"]
            });
        }
    })
}

export const useDeletarProduto = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/produtos/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["produtos"]
            });
        }
    })
}