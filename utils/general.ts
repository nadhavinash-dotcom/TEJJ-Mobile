import { API_URL } from "@/constants/urls";

export const getAbsoluteUrl = (url: string) => {
    return url.startsWith('http') ? url : `${API_URL}${url}`;
}