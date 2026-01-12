import { createApiInstance } from '../../config/api-connection-config.js'
import { axiosRequest } from '../../config/api-connection-service.js';
import { ENV } from '../../config/env.js';
import { TerraceApiType } from '../../models/terrace-model/zod/terrace-schema.js';


const TERRACE_API: string = ENV.TERRACE_API_URL || "";

if (!TERRACE_API) {
    throw new Error("Environment variable TERRACE_API_URL is not defined");
}

export const apiTerrace = createApiInstance(TERRACE_API);

export async function fetchDataTerraces(): Promise<TerraceApiType[]> {

    try {
        const response = await axiosRequest(apiTerrace, TERRACE_API, { limit: 3 });

        const totalLength = response?.result?.total;

        const records = response?.result?.records;
        if (!records || records.length === 0) {
            console.error("❌ No terrace records found");
            return [];
        }

        return records;

    } catch (error) {
        console.error("❌ Error fetching terraces, error:", error);
        return [];
    }
    
}