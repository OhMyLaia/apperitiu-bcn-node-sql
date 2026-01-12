import type { BusinessApiType } from "../../../models/terrace-model/zod/business-schema.js";
import { TerraceApiType } from "../../../models/terrace-model/zod/terrace-schema.js";

export function matchByCoords(
    terrace: TerraceApiType,
    businesses: BusinessApiType[],
    coordinateTolerance: number // ~5m precision
): BusinessApiType[] | null {

    if (!Array.isArray(businesses)) return null;

    const matches = businesses.filter(biz => {
        // console.warn(`biz ${biz} vs terrace ${terrace}`)
        const latDiff = Math.abs(parseFloat(biz.Latitud) - parseFloat(terrace.LATITUD));
        const longDiff = Math.abs(parseFloat(biz.Longitud) - parseFloat(terrace.LONGITUD));
        // console.log(`→ Biz: ${biz.Nom_Local}, latDiff: ${latDiff}, longDiff: ${longDiff}`);
        return latDiff < coordinateTolerance && longDiff < coordinateTolerance;
    })
    
    // console.log(`${matches.map((biz) => biz.Nom_Local)}`);

    return matches.length > 0 ? matches : null;

}