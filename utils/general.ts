export const getAbsoluteUrl = (url: string) => {
    return url.startsWith('http') ? url : `${process.env.EXPO_PUBLIC_API_URL}${url}`;
}