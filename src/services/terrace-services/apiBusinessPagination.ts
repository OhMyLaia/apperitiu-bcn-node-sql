
import { axiosRequest } from "../../config/api-connection-service.js";
import { BusinessApiType } from "../../models/terrace-model/zod/business-schema.js";
import { apiBusiness } from "./business.service.js";
import { ENV } from "../../config/env.js";


export async function fetchAllBusinessPages(): Promise<BusinessApiType[]> {
    const allBusinesses: BusinessApiType[] = [];
    let nextUrl: string | null = ENV.BUSINESS_API_URL;
    let index = 0;

    try {
        while (nextUrl) {
            const response = await axiosRequest(apiBusiness, nextUrl);
            const records = response?.result?.records;

            if (!records || records.length === 0) {
                console.log("✔️ No more businesses to fetch");
                break;
            }

            // only restaurants/bars/hotels
            for (const record of records) {
                if (record.Codi_Activitat_2022 === "1400002" ||
                    record.Codi_Activitat_2022 === "1400003") {
                    allBusinesses.push(record);
                }
            }

            console.log(`✅ Page ${index + 1}: fetched ${records.length} businesses, total saved: ${allBusinesses.length}`);

            const nextLink = response.result._links?.next;
            nextUrl = nextLink
                ? `https://opendata-ajuntament.barcelona.cat/data${nextLink}`
                : null;

            index++;
            if (nextUrl) await new Promise((res) => setTimeout(res, 3000));
        }

        console.log(`🏁 Finished fetching businesses: ${allBusinesses.length}`);
        return allBusinesses;

    } catch (error: any) {
        console.error("❌ Error fetching businesses:", error?.message || error);
        throw error;
    }
}
