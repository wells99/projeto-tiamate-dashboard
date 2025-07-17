import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, queryClient } from "../services"

export const useBuscarUsuarios = () => {
    return useQuery({
        queryKey: ["usuarios"],
        queryFn: async () => {
            const res = await AXIOS.get("/usuarios");
            return res.data;
        }
    })
}

export const useCriarUsuario = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/usuarios", dados);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["usuarios"]
            });
        }
    })
}

export const useEditarUsuario = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/usuarios/${dados.usuario_id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["usuarios"]
            });
        }
    })
}

export const useDeletarUsuario = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/usuarios/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["usuarios"]
            });
        }
    })
}