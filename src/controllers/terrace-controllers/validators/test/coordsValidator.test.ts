
import type { TerraceApiType } from '../../../../models/terrace-model/zod/terrace-schema.js';
import type { BusinessApiType } from '../../../../models/terrace-model/zod/business-schema.js';
import { readJsonArray } from '../../../../utils/terrace-utils/readJson.js';
import { describe, it, expect, beforeAll } from 'vitest';
import { matchByCoords } from '../coordsValidator.js';

let businesses: BusinessApiType[] = [];
let terraces: TerraceApiType[] = [];

beforeAll(async () => {
    try {
        const fullBusinesses = await readJsonArray<BusinessApiType>("./businesses-restaurants.json");
        const fullTerraces = await readJsonArray<TerraceApiType>("./terraces.json");
        businesses = fullBusinesses.slice(0, 6000);
        terraces = fullTerraces.slice(0, 6000);
        console.log('Loaded businesses in match x coords:', businesses.length);
        console.log('Loaded terraces: in match x coords', terraces.length);
    } catch (error) {
        console.error('❌ Error loading JSONs:', error);
    }
});

describe('matchByCoords', () => {
    it('returns null when businesses is not an array', () => {
        const result = matchByCoords(terraces[0], null as any, 0.000045);
        expect(result).toBeNull();
    });

    it('returns empty array when no business is within coordinate tolerance', () => {
        const fakeTerrace: TerraceApiType = {
            ...terraces[0],
            LATITUD: "0.000000",
            LONGITUD: "0.000000"
        };

        const result = matchByCoords(fakeTerrace, businesses, 0.000045);
        expect(result).toBeNull();
    });

    it('returns at least one match when business is very close to terrace', () => {
        // This assumes at least one match exists in first 100 businesses
        const testTerrace = terraces.find(t => {
            return businesses.some(b => {
                const latDiff = Math.abs(parseFloat(b.Latitud) - parseFloat(t.LATITUD));
                const longDiff = Math.abs(parseFloat(b.Longitud) - parseFloat(t.LONGITUD));
                return latDiff < 0.0002 && longDiff < 0.0002;
            });
        });

        expect(testTerrace).toBeDefined();

        const result = matchByCoords(testTerrace!, businesses, 0.0002);
        expect(result).not.toBeNull();
        expect(result!.length).toBeGreaterThan(0);
        console.log('Test terrace used:', testTerrace?.EMPLACAMENT);

if (result) {
    console.log('Matched businesses:', result.map(b => b.Nom_Local));
}
    });
});