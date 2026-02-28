import axios, { type AxiosInstance } from "axios"

//Defined Api URL
export function createHttpClient(): AxiosInstance {
    return axios.create({
        baseURL: "http://localhost:5000/api/v1",
        withCredentials: true, // For refresh cookie
    });
}