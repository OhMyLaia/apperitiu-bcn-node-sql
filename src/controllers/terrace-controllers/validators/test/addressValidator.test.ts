// import { describe, it, expect, beforeAll, vi } from 'vitest';
// import { matchByCoordsAndAddress } from '../addressValidator.js';
// import type { TerraceApiType } from '../../../../models/terrace-model/zod/terrace-schema.js';
// import type { BusinessApiType } from '../../../../models/terrace-model/zod/business-schema.js';
// import { normalizeString } from '../../../../utils/terrace-utils/stringNormalizer.js';


// describe('matchByCoordsAndAddress', () => {
//     const mockTerrace: TerraceApiType = {
//         "LATITUD": "41.3850150634256",
//         "CODI_DISTRICTE": "4",
//         "EMPLACAMENT": "C. BERLIN, 105",
//         "CADIRES_CALCADA": "0",
//         "TAULES_CALCADA": "0",
//         "DATA_EXPLO": "2025-01-01T00:00:00",
//         "CADIRES": "4",
//         "Y_ETRS89": "81854286",
//         "VIGENCIA": "Anual",
//         "X_ETRS89": "28227342",
//         "NOM_BARRI": "les Corts",
//         "CADIRES_VORERA": "4",
//         "TAULES_VORERA": "1",
//         "OCUPACIO": "Terrasses en Via Pública",
//         "NOM_DISTRICTE": "Les Corts",
//         "CODI_BARRI": "19",
//         "TAULES": "1",
//         "_id": 5809,
//         "ORDENACIO": "General",
//         "LONGITUD": "2.14158456921759",
//         "SUPERFICIE_OCUPADA": "2.25"
//     };

//     const validBusiness: BusinessApiType = {
//         "Nom_CComercial": "",
//         "Seccio_Censal": "1",
//         "SN_Eix": "No",
//         "Nom_Galeria": "",
//         "Codi_Via": "40300",
//         "Nom_Eix": "",
//         "Codi_Districte": "4",
//         "SN_Mixtura": "No",
//         "Lletra_Inicial": "",
//         "Codi_Activitat_2022": "1400002",
//         "Direccio_Unica": "040300, 105-105, LOC 20",
//         "ID_Global": "1f2b4f24-489d-41e5-a183-bd00f21f8b32",
//         "Nom_Activitat": "Restaurants",
//         "Nom_Mercat": "",
//         "Lletra_Final": "",
//         "Codi_Principal_Activitat": "1",
//         "Num_Policia_Inicial": "105",
//         "ID_Bcn_2016": "41689",
//         "Nom_Grup_Activitat": "Restaurants, bars i hotels (Inclòs hostals, pensions i fondes)",
//         "Referencia_Cadastral": "8320203DF2882A",
//         "SN_Coworking": "No",
//         "Solar": "126622",
//         "SN_Mercat": "No",
//         "Nom_Via": "BERLIN", // Changed from "BERLÍN" to match normalized version
//         "Longitud": "2.14162454",
//         "Codi_Sector_Activitat": "2",
//         "X_UTM_ETRS89": "428230.704",
//         "Y_UTM_ETRS89": "4581856.225",
//         "SN_CComercial": "No",
//         "SN_Carrer": "Si",
//         "Porta": "20",
//         "Codi_Illa": "71010",
//         "Planta": "LOC",
//         "SN_Servei_Degustacio": "No",
//         "Num_Policia_Final": "105",
//         "Nom_Principal_Activitat": "Actiu",
//         "Nom_Local": "CICO",
//         "Codi_Barri": "19",
//         "SN_Obert24h": "No",
//         "Codi_Activitat_2016": "1400002",
//         "Latitud": "41.385032832",
//         "Codi_Grup_Activitat": "14",
//         "SN_Galeria": "No",
//         "Nom_Districte": "Les Corts",
//         "Nom_Sector_Activitat": "Serveis",
//         "Codi_Parcela": "3",
//         "Nom_Barri": "les Corts",
//         "SN_Oci_Nocturn": "No",
//         "_id": 1371,
//         "Data_Revisio": "2023-06-06T00:00:00"
//     };

//     it('should return valid match when both street name and number are present', () => {
//         const businesses = [validBusiness];

//         const result = matchByCoordsAndAddress(mockTerrace, businesses);

//         expect(result.validMatches).toHaveLength(1);
//         expect(result.validMatches[0]).toEqual(validBusiness);
//         expect(result.invalidMatches).toHaveLength(0);
//     });

//     it('should return invalid match with MISSING_NUMBER reason when street matches but number is missing', () => {
//         const businessMissingNumber: BusinessApiType = {
//             ...validBusiness,
//             Num_Policia_Inicial: "", // Missing number
//             Nom_Local: "Test Business"
//         };

//         const businesses = [businessMissingNumber];

//         const result = matchByCoordsAndAddress(mockTerrace, businesses);

//         expect(result.validMatches).toHaveLength(0);
//         expect(result.invalidMatches).toHaveLength(1);
//         expect(result.invalidMatches[0]).toEqual({
//             name: "Test Business",
//             address: "C. BERLIN, 105",
//             lat: "41.385032832",
//             long: "2.14162454",
//             reason: "MISSING_NUMBER"
//         });
//     });

//     it('should return invalid match with MISSING_STREET reason when number matches but street is missing', () => {
//         const businessMissingStreet: BusinessApiType = {
//             ...validBusiness,
//             Nom_Via: "", // Missing street name
//             Nom_Local: "Another Business"
//         };

//         const businesses = [businessMissingStreet];

//         const result = matchByCoordsAndAddress(mockTerrace, businesses);

//         expect(result.validMatches).toHaveLength(0);
//         expect(result.invalidMatches).toHaveLength(1);
//         expect(result.invalidMatches[0]).toEqual({
//             name: "Another Business",
//             address: "C. BERLIN, 105",
//             lat: "41.385032832",
//             long: "2.14162454",
//             reason: "MISSING_STREET"
//         });
//     });

//     it('should return invalid match with BOTH_MISSING reason when neither street nor number match', () => {
//         const businessBothMissing: BusinessApiType = {
//             ...validBusiness,
//             Nom_Via: "DIFFERENT STREET",
//             Num_Policia_Inicial: "999",
//             Nom_Local: "Unmatched Business"
//         };

//         const businesses = [businessBothMissing];

//         const result = matchByCoordsAndAddress(mockTerrace, businesses);

//         expect(result.validMatches).toHaveLength(0);
//         expect(result.invalidMatches).toHaveLength(1);
//         expect(result.invalidMatches[0]).toEqual({
//             name: "Unmatched Business",
//             address: "C. BERLIN, 105",
//             lat: "41.385032832",
//             long: "2.14162454",
//             reason: "BOTH_MISSING"
//         });
//     });

//     it('should handle business with null/undefined Nom_Local', () => {
//         const businessNoName: BusinessApiType = {
//             ...validBusiness,
//             Nom_Via: "DIFFERENT STREET",
//             Num_Policia_Inicial: "999",
//             Nom_Local: null as any // Simulate missing name
//         };

//         const businesses = [businessNoName];

//         const result = matchByCoordsAndAddress(mockTerrace, businesses);

//         expect(result.invalidMatches[0].name).toBe("Unknown name");
//     });

//     it('should handle empty businesses array', () => {
//         const businesses: BusinessApiType[] = [];

//         const result = matchByCoordsAndAddress(mockTerrace, businesses);

//         expect(result.validMatches).toHaveLength(0);
//         expect(result.invalidMatches).toHaveLength(0);
//     });

//     it('should handle multiple businesses with mixed match results', () => {
//         const businesses = [
//             validBusiness, // Valid match
//             {
//                 ...validBusiness,
//                 Nom_Via: "DIFFERENT STREET",
//                 Num_Policia_Inicial: "999", // Different number too
//                 Nom_Local: "Invalid Business 1",
//                 Latitud: "41.111111",
//                 Longitud: "2.111111"
//             }, // Both missing
//             {
//                 ...validBusiness,
//                 Num_Policia_Inicial: "",
//                 Nom_Local: "Invalid Business 2",
//                 Latitud: "41.222222",
//                 Longitud: "2.222222"
//             } // Missing number
//         ];

//         const result = matchByCoordsAndAddress(mockTerrace, businesses);

//         expect(result.validMatches).toHaveLength(1);
//         expect(result.validMatches[0].Nom_Local).toBe("CICO");

//         expect(result.invalidMatches).toHaveLength(2);

//         // Check the reasons - order might be different than expected
//         const reasons = result.invalidMatches.map(m => m.reason);
//         expect(reasons).toContain("BOTH_MISSING");
//         expect(reasons).toContain("MISSING_NUMBER");
//     });

//     it('should handle null/undefined street name and number gracefully', () => {
//         const businessNullFields: BusinessApiType = {
//             ...validBusiness,
//             Nom_Via: null as any,
//             Num_Policia_Inicial: null as any,
//             Nom_Local: "Null Fields Business"
//         };

//         const businesses = [businessNullFields];

//         const result = matchByCoordsAndAddress(mockTerrace, businesses);

//         expect(result.validMatches).toHaveLength(0);
//         expect(result.invalidMatches).toHaveLength(1);
//         expect(result.invalidMatches[0].reason).toBe("BOTH_MISSING");
//     });

//     it('should be case insensitive for street matching', () => {
//         const businessLowerCase: BusinessApiType = {
//             ...validBusiness,
//             Nom_Via: "berlin", // lowercase
//             Nom_Local: "Case Test Business"
//         };

//         const businesses = [businessLowerCase];

//         const result = matchByCoordsAndAddress(mockTerrace, businesses);

//         expect(result.validMatches).toHaveLength(1);
//         expect(result.validMatches[0].Nom_Local).toBe("Case Test Business");
//     });

//     it('should handle partial street name matches', () => {
//         const businessPartialStreet: BusinessApiType = {
//             ...validBusiness,
//             Nom_Via: "BERL", // Partial match
//             Nom_Local: "Partial Match Business"
//         };

//         const businesses = [businessPartialStreet];

//         const result = matchByCoordsAndAddress(mockTerrace, businesses);

//         // Since "c berlin 105" contains "berl", this should be a valid match
//         expect(result.validMatches).toHaveLength(1);
//         expect(result.validMatches[0].Nom_Local).toBe("Partial Match Business");
//     });

//     it('should handle accent differences in street names', () => {
//         const businessWithAccent: BusinessApiType = {
//             ...validBusiness,
//             Nom_Via: "BERLÍN", // With accent
//             Nom_Local: "Accent Test Business"
//         };

//         const businesses = [businessWithAccent];

//         const result = matchByCoordsAndAddress(mockTerrace, businesses);

//         // It seems your normalizeString DOES handle accents properly, so this should match
//         expect(result.validMatches).toHaveLength(1);
//         expect(result.validMatches[0].Nom_Local).toBe("Accent Test Business");
//         expect(result.invalidMatches).toHaveLength(0);
//     });



//     it('flags invalid matches when street name is missing', () => {
//         const testTerrace: TerraceApiType = {
//             ...mockTerrace,
//             EMPLACAMENT: "C. BERLIN, 105"
//         };
    
//         const testBusiness: BusinessApiType = {
//             ...validBusiness,
//             Nom_Via: '', // ❗ Simulate missing street
//             Num_Policia_Inicial: '105', // ✅ Matching number
//             Nom_Local: 'Missing Street Biz'
//         };
    
//         const result = matchByCoordsAndAddress(testTerrace, [testBusiness]);
    
//         expect(result.validMatches).toHaveLength(0);
//         expect(result.invalidMatches).toHaveLength(1);
//         expect(result.invalidMatches[0]).toEqual({
//             name: 'Missing Street Biz',
//             address: 'C. BERLIN, 105',
//             lat: '41.385032832',
//             long: '2.14162454',
//             reason: 'MISSING_STREET'
//         });
//     });
// });