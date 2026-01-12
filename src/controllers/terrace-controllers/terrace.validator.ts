import { fetchAllDataFromApis } from "../../services/terrace-services/all.data.service.js";
import { matchByCoords } from "./validators/coordsValidator.js";
import { createOrUpdateTerrace } from "./validators/createOrUpdateTerrace.js";
import type { TerraceApiType } from "../../models/terrace-model/zod/terrace-schema.js";
import { BusinessApiType } from "../../models/terrace-model/zod/business-schema.js";
// import { readJsonArray } from "../../utils/terrace-utils/readJson.js";

const customTerracesData: any[] = [];
let uniqueBusinesses: BusinessApiType[] = [];
let count = 0;

export async function createCustomValidatedTerrace() {

    try {
        const { businesses, terraces } = await fetchAllDataFromApis();
        // fullBusinesses = await readJsonArray<BusinessApiType>("./businesses-restaurants.json");
        // fullTerraces = await readJsonArray<TerraceApiType>("./terraces.json");
        // businesses = fullBusinesses.slice(0,100);
        // terraces = fullTerraces.slice(0,200);
        console.log('Loaded businesses in createCustomValidatedTerrace():', businesses.length);
        console.log('Loaded terraces: in createCustomValidatedTerrace()', terraces.length);

        const unmatchedTerraces: TerraceApiType[] = [];

        for (let i = 0; i < terraces.length; i++) {
            const terrace = terraces[i];

            if (!terrace || !businesses) {
                console.error(`no data to validate`);
                continue;
            }

            let matchingBusinesses: BusinessApiType[] = matchByCoords(
                terrace,
                businesses,
                0.000063
            ) || [];

            uniqueBusinesses = Array.from(
                new Map(matchingBusinesses.map(biz => [biz.ID_Global, biz])).values()
            );

            if (uniqueBusinesses.length === 0) {
                unmatchedTerraces.push(terrace);
                continue;
            }

            console.log(`Terrace ${i} (${terrace.EMPLACAMENT}) matched ${uniqueBusinesses.length} businesses`);

            for (const biz of uniqueBusinesses) {
                count++;
                console.warn(biz.Nom_Local);
                await createOrUpdateTerrace(terrace, biz);
            }

        }

        if (unmatchedTerraces.length > 0) {
            console.warn(`There are ${unmatchedTerraces.length} unmatched terraces.`);
            console.warn(`There are ${customTerracesData.length} matched terraces.`);
        }

    } catch (error) {
        console.error('❌ Error fetching data:', error);
    }
}