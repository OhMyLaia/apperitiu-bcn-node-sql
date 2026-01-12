import { normalizeString } from "../../../utils/terrace-utils/stringNormalizer.js";
import type { BusinessApiType } from "../../../models/terrace-model/zod/business-schema.js";
import { TerraceApiType } from "../../../models/terrace-model/zod/terrace-schema.js";

export type InvalidMatch = {
    name: string;
    address: string;
    lat: string;
    long: string;
    reason: 'MISSING_STREET' | 'MISSING_NUMBER' | 'BOTH_MISSING';
}

// export function matchByCoordsAndAddress(
//     terrace: TerraceApiType,
//     businesses: BusinessApiType[]
// ) {

//     const validMatches: BusinessApiType[] = [];
//     const invalidMatches: InvalidMatch[] = [];

//     const emplacement = normalizeString(terrace.EMPLACAMENT);

//     businesses.forEach(biz => {
//         const streetName = normalizeString(biz.Nom_Via) || '';
//         const streetNumber = biz.Num_Policia_Inicial || '';

//         const hasStreet = streetName && emplacement.includes(streetName);
//         const hasNumber = streetNumber && emplacement.includes(streetNumber);

//         if (hasStreet && hasNumber) {
//             validMatches.push(biz);

//         } else {
//             let reason: InvalidMatch['reason'] = 'BOTH_MISSING';
//             if (hasStreet && !hasNumber) reason = 'MISSING_NUMBER';
//             if (!hasStreet && hasNumber) reason = 'MISSING_STREET';

//             invalidMatches.push({
//                 name: biz.Nom_Local || 'Unknown name',
//                 address: terrace.EMPLACAMENT,
//                 lat: biz.Latitud,
//                 long: biz.Longitud,
//                 reason
//             });
//         }
//     });

//     return {
//         validMatches,
//         invalidMatches
//     };
// }

// export function matchByCoordsAndAddress(
//     terrace: TerraceApiType,
//     businesses: BusinessApiType[]
// ) {
//     const validMatches: BusinessApiType[] = [];
//     const invalidMatches: InvalidMatch[] = [];

//     const emplacement = normalizeString(terrace.EMPLACAMENT);

//     businesses.forEach(biz => {
//         const streetName = normalizeString(biz.Nom_Via);
//         const streetNumber = biz.Num_Policia_Inicial;

//         // Check if street name exists and is found in emplacement
//         const hasStreet = streetName && streetName.length > 0 && emplacement.includes(streetName);
        
//         // Check if street number exists and is found in emplacement
//         const hasNumber = streetNumber && streetNumber.length > 0 && emplacement.includes(streetNumber);

//         if (hasStreet && hasNumber) {
//             validMatches.push(biz);
//         } else {
//             let reason: InvalidMatch['reason'] = 'BOTH_MISSING';
            
//             if (hasStreet && !hasNumber) {
//                 reason = 'MISSING_NUMBER';
//             } else if (!hasStreet && hasNumber) {
//                 reason = 'MISSING_STREET';
//             }

//             invalidMatches.push({
//                 name: biz.Nom_Local || 'Unknown name',
//                 address: terrace.EMPLACAMENT,
//                 lat: biz.Latitud,
//                 long: biz.Longitud,
//                 reason
//             });
//         }
//     });

//     return {
//         validMatches,
//         invalidMatches
//     };
// }


export function matchByCoordsAndAddress(
    terrace: TerraceApiType,
    businesses: BusinessApiType[]
) {
    const validMatches: BusinessApiType[] = [];
    const invalidMatches: InvalidMatch[] = [];

    const emplacement = normalizeString(terrace.EMPLACAMENT);

    businesses.forEach(biz => {
        // Get normalized street name, handling null/undefined/empty cases
        const rawStreetName = biz.Nom_Via;
        const normalizedStreetName = rawStreetName ? normalizeString(rawStreetName) : '';
        
        // Get street number, handling null/undefined cases  
        const rawStreetNumber = biz.Num_Policia_Inicial;
        const streetNumber = rawStreetNumber ? rawStreetNumber.toString().trim() : '';

        // Check if we have valid street name and it's found in emplacement
        const hasValidStreet = normalizedStreetName.length > 0;
        const streetFoundInEmplacement = hasValidStreet && emplacement.includes(normalizedStreetName);
        
        // Check if we have valid street number and it's found in emplacement
        const hasValidNumber = streetNumber.length > 0;
        const numberFoundInEmplacement = hasValidNumber && emplacement.includes(streetNumber);

        // A match is valid if both street and number are found in the emplacement
        const hasStreet = streetFoundInEmplacement;
        const hasNumber = numberFoundInEmplacement;

        // Debug logging (remove this after fixing)
        console.log(`Business: ${biz.Nom_Local}`);
        console.log(`  Raw street: "${rawStreetName}", normalized: "${normalizedStreetName}"`);
        console.log(`  Raw number: "${rawStreetNumber}", cleaned: "${streetNumber}"`);
        console.log(`  Emplacement: "${emplacement}"`);
        console.log(`  hasStreet: ${hasStreet}, hasNumber: ${hasNumber}`);

        if (hasStreet && hasNumber) {
            validMatches.push(biz);
        } else {
            let reason: InvalidMatch['reason'] = 'BOTH_MISSING';
            
            if (hasStreet && !hasNumber) {
                reason = 'MISSING_NUMBER';
            } else if (!hasStreet && hasNumber) {
                reason = 'MISSING_STREET';
            }
            console.log('→ hasNumber:', hasNumber, ' | streetNumber:', streetNumber, ' | emplacement:', emplacement);

            invalidMatches.push({
                name: biz.Nom_Local || 'Unknown name',
                address: terrace.EMPLACAMENT,
                lat: biz.Latitud,
                long: biz.Longitud,
                reason
            });
        }
    });

    return {
        validMatches,
        invalidMatches
    };
}