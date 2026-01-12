import { fetchDataBusiness } from "./business.service.js";
import { fetchDataTerraces } from "./terrace.service.js";
import type { BusinessApiType } from "../../models/terrace-model/zod/business-schema.js";
import type { TerraceApiType } from "../../models/terrace-model/zod/terrace-schema.js";
import { fetchAllTerracePages } from "./apiTerracePagination.js";
import { fetchAllBusinessPages } from "./apiBusinessPagination.js";

export async function fetchAllDataFromApis() {
    const [businesses, terraces] = await Promise.all([
        fetchAllBusinessPages() as Promise<BusinessApiType[]>,
        fetchAllTerracePages() as Promise<TerraceApiType[]>
    ])
    return { businesses, terraces }
};
