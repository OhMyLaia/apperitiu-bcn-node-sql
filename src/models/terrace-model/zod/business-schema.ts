import { z } from "zod";

export const BusinessSchema = z.object({

    Nom_CComercial: z.string(),
    Codi_Districte: z.string(),
    Codi_Activitat_2022: z.string(),
    ID_Global: z.string(),
    Referencia_Cadastral: z.string(),
    Nom_Via: z.string(),
    Longitud: z.string(),
    Num_Policia_Inicial: z.string(),
    Nom_Local: z.string(),
    Codi_Barri: z.string(),
    // Codi_Activitat_2016: z.string(),
    Latitud: z.string(),
    Codi_Grup_Activitat: z.string(),
    Nom_Districte: z.string(),
    Nom_Barri: z.string(),
}).passthrough();;

export type BusinessApiType = z.infer<typeof BusinessSchema>;