import { axiosRequest } from "../../config/api-connection-service.js";
import { TerraceApiType } from "../../models/terrace-model/zod/terrace-schema.js";
import { apiTerrace } from "./terrace.service.js";
import { ENV } from "../../config/env.js";

export async function fetchAllTerracePages(): Promise<TerraceApiType[]> {
    const allTerraces: TerraceApiType[] = [];
    let nextUrl: string | null = ENV.TERRACE_API_URL;
    let index = 0;

    try {
        while (nextUrl) {
            const response = await axiosRequest(apiTerrace, nextUrl);
            const records = response?.result?.records;

            if (!records || records.length === 0) {
                console.log("✔️ No more terraces to fetch");
                break;
            }

            allTerraces.push(...records);

            console.log(`✅ Page ${index + 1}: fetched ${records.length} terraces, total so far: ${allTerraces.length}`);

            const nextLink = response.result._links?.next;
            nextUrl = nextLink
                ? `https://opendata-ajuntament.barcelona.cat/data${nextLink}`
                : null;

            index++;
            if (nextUrl) await new Promise((res) => setTimeout(res, 3000));
        }

        console.log(`🏁 Finished fetching terraces: ${allTerraces.length}`);
        return allTerraces;

    } catch (error: any) {
        console.error("❌ Error fetching terraces:", error?.message || error);
        throw error;
    }
}