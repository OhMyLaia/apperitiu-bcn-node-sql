import { createApiInstance } from '../../config/api-connection-config.js'
import { axiosRequest } from '../../config/api-connection-service.js';
import { ENV } from '../../config/env.js';

const BUSINESS_API: string = ENV.BUSINESS_API_URL || "";

if (!BUSINESS_API) {
    throw new Error("Environment variable BUSINESS_API_URL is not defined");
}

export const apiBusiness = createApiInstance(BUSINESS_API);

export async function fetchDataBusiness(): Promise<object[]> {

    try {
        const response = await axiosRequest(apiBusiness, BUSINESS_API, {limit: 3});

        const records = response?.result?.records;
        if (!records) return [];

        console.warn("✅👔 Received data from api businesses:", records.length);
        return records;

    } catch(error) {
        console.log("❌ Error fetching businesses, error:", error);
        return [];
    }
}
