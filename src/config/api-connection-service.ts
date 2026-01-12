import axios from "axios";
import type { AxiosInstance } from "axios";

// CREATE (POST)
export const axiosCreate = async (
    api: AxiosInstance,
    endpoint: string,
    input: {}
) => {

    try {
        const response = await api.post(endpoint, input);
        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error creating object, error: ${error}`);
            console.error("API Error:", error.response?.data.message);

        } else {
            console.error("Unexpected Error:", error);
        }
        return null;
    }
}

// READ (GET) - API_KEY --> queryParams
export const axiosRequest = async (
    api: AxiosInstance,
    url: string,
    queryParams?: object | number
) => {

    let apiResponse: JSON | object[] | null = null;
    let apiError: {} | null = null;


    try {
        const response = await api.get(url, {
            params: queryParams
        });
        return apiResponse = response.data;

    } catch (error) {

        if (axios.isAxiosError(error)) {
            apiError = {
                name: error.name || "AxiosError",
                message: error.message,
                status: error.response?.status
            };
        } else {
            return apiError = {
                name: "UnknownError",
                message: "An unknown error occurred",
                status: undefined
            };
        }
    }

    return null;
}

// UPDATE (PUT)
export const axiosUpdate = async (
    api: AxiosInstance,
    endpoint: string,
    id: string,
    updatedObj: object
) => {

    try {
        const response = await api.put(`${endpoint}/${id}`, updatedObj);
        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error updating object id:${id}, error: ${error}`);
            console.error("API Error:", error.response?.data.message);

        } else {
            console.error("Unexpected Error:", error);
        }
        return null;
    }

}

// DELETE
export const axiosDelete = async (
    api: AxiosInstance,
    endpoint: string,
    id: string
) => {

    try {
        await api.delete(`${endpoint}/${id}`);
        return console.warn(`User id:${id} deleted successfully.`)

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error deleting object id: ${id}, eror: ${error}`)
            console.error("API Error:", error.response?.data.message);

        } else {
            console.error("Unexpected Error:", error);
        }
        return null;
    }
}