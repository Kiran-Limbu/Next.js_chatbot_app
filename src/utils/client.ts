import axios from "axios";


let baseApi = process.env.BASE_URL as string;

const apiClientWraper = axios.create({
    baseURL: baseApi,
    withCredentials: true,
});

export default apiClientWraper;
