import { TerraceApiType } from "../../../models/terrace-model/zod/terrace-schema.js";
import { BusinessApiType } from "../../../models/terrace-model/zod/business-schema.js";
import { defaultOpeningHours } from "../../../utils/terrace-utils/defaultOpeningHours.js";
import Terrace from "../../../models/terrace-model/db/terrace-model-sequelize.js";

export async function createOrUpdateTerrace(
    terrace: Partial<TerraceApiType>,
    biz: Partial<BusinessApiType>
) {
    const data = {
        business_name: biz.Nom_Local,
        cadastro_ref: biz.Referencia_Cadastral,
        address: terrace.EMPLACAMENT,
        activity_code: parseInt(biz.Codi_Activitat_2022 || '0'),
        group_activity_code: parseInt(biz.Codi_Activitat_2022 || '0'),
        district_name: terrace.NOM_DISTRICTE,
        district_code: parseInt(terrace.CODI_DISTRICTE || '0'),
        neighbourhood_name: terrace.NOM_BARRI,
        neighbourhood_code: parseInt(terrace.CODI_BARRI || '0'),
        zip_code: '0',
        tables: parseInt(terrace.TAULES || '0'),
        seats: parseInt(terrace.CADIRES || '0'),
        latitude: parseFloat(terrace.LATITUD || '0'),
        longitude: parseFloat(terrace.LONGITUD || '0'),
        average_price: undefined,
        average_rating: undefined,
        has_wifi: undefined,
        pet_friendly: undefined,
        can_smoke: undefined,
        has_disabled_access: undefined,
        has_kitchen: undefined,
        reservation_fee: 0,
        is_claimed: false,
        instagram_account: '',
        website: '',
        profile_pic: '',
        opening_hours: defaultOpeningHours,
    };

    const existing = await Terrace.findOne({
        where: { cadastro_ref: biz.Referencia_Cadastral }
    });

    if (existing) {
        await existing.update(data);
    } else {
        await Terrace.create(data);
    }
}