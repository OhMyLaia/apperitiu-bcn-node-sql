import { Router } from "express";
import {
  getAllTerraces,
  getTerraceById,
  createNewTerrace,
  //updateTerrace,
  deleteTerrace,
  getTerraceByCatastroRef,
  updateTerraceWithPassword,
} from "../../controllers/terrace-controllers/terrace.controller.js";

import { isTokenValid } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/terraces", getAllTerraces);
router.post("/terraces", createNewTerrace);
router.get("/terraces/:id", getTerraceById);
router.put("/terraces/:id", isTokenValid, updateTerraceWithPassword);
//router.put("/terraces/:id", updateTerrace);
router.delete("/terraces/:id", deleteTerrace);

router.get("/terraces/by-catastro/:catastroRef", getTerraceByCatastroRef);


export default router;

// {
//     id: biz.ID_Global,
//     business_name: biz.Nom_CComercial,
//     cadastro_ref: biz.Referencia_Cadastral,
//     street_type: biz.Nom_Via,
//     street_address: biz.Nom_Local,
//     door_address: biz.Porta,
//     activity_code: biz.Codi_Activitat_2022,
//     group_activity_code: biz.Codi_Activitat_2022,
//     postal_code: undefined
//     district_name: biz.Codi_Districte, // 👈 name might need mapping (check this)
//     district_code: biz.Codi_Districte,
//     neighbourhood_name: biz.Nom_Barri,
//     neighbourhood_code: biz.Codi_Barri,
//     postal_code: undefined,
//     tables: terrace.TAULES,
//     seats: terrace.CADIRES,
//     latitude: terrace.LATITUD,
//     longitude: terrace.LONGITUD,
//     average_price: undefined,
//     average_rating: undefined,
//     has_wifi: undefined,
//     pet_friendly: undefined,
//     can_smoke: undefined,
//     has_disabled_acces: undefined,
//     has_kitchen: undefined,

//     has_promos: undefined,
//     reservation_fee: undefined,
//     is_premium: undefined,
//     is_verified: undefined,
//     instagram_account: undefined,
//     food_category: undefined,
//     placement_type: undefined,
//     emotional_tags: undefined,
//     cover_type: undefined,
//     dietary_restrictions: undefined,
//     profile_pic: undefined,
//     opening_hours: undefined
//   }
