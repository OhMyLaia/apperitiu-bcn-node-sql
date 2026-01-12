//import Terrace from "../../../models/terrace-model/db/terrace-model-sequelize.js";
//import { getRandomTerraceImage } from "./default.images.service.js";

// export async function assignRandomImagesToTerraces() {
//     let processedCount = 0;

//     try {
//         const terraces = await Terrace.findAll();

//         for (const terrace of terraces) {

//             const imageUrl = await getRandomTerraceImage('restaurant city terrace');
//             await new Promise(resolve => setTimeout(resolve, 19000));
//             await terrace.update({ profile_pic: imageUrl });
//             processedCount++;
//         }

//         console.log(`Random image assignment completed, total of: ${processedCount}/${terraces.length} updated profile_pics`);

//     } catch (error) {
//         console.error('Error in image assignment:', error);
//     }
// }