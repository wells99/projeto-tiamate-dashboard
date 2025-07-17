import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, queryClient } from "../services"

export const useBuscarPictures = () => {
    return useQuery({
        queryKey: ["pictures"],
        queryFn: async () => {
            const res = await AXIOS.get("/pictures");
            return res.data;
        }
    })
}

export const useCriarPicture = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/pictures", dados, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["pictures"]
            });
        }
    })
}

export const useEditarPicture = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/pictures/${dados.picture_id}`, dados, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["pictures"]
            });
        }
    })
}

export const useDeletarPicture = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/pictures/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["pictures"]
            });
        }
    })
}