import Terrace from "../../models/terrace-model/db/terrace-model-sequelize.js";
import { CustomTerraceSchema } from "../../models/terrace-model/zod/customTerrace-schema.js";
import { Request, Response } from 'express';

// // http://localhost:8080/terraces/:id/tags
// // POST items/:id/tags
// export const addTerraceTags = async (req: Request, res: Response) => {
//     const terraceID = req.params.id;
//     const tagsData = req.body;

//     if (!terraceID) {
//         return res.status(400).json({ error: "Invalid or inexistent terrace ID" });
//     }

//     try {

//         if (!tagsData) {
//             return res.status(204).json({ error: "Invalid or empty tags data" });
//         }
//         console.warn("💡 tagsData validated:", tagsData);

//         const terrace = await Terrace.findByPk(terraceID);
        
//         if (!terrace) {
//             return res.status(404).json({ error: "Terrace not found" });
//         }

//         const updatedTags = { ...(terrace.tags || {}), ...tagsData };
        
//         await terrace.update({ tags: updatedTags });
        
//         return res.status(201).json({
//             terraceId: terraceID,
//             tags: updatedTags
//         });

//     } catch (error: any) {
//         if (error.name === "ZodError") {
//             console.error("🔥 FULL ERROR:", error);
//             return res.status(400).json({ 
//                 error: "❌ Tags validation failed", 
//                 details: error.errors 
//             });
//         }

//         console.error(`❌ Error adding tags to terrace ${terraceID}:`, error);
//         return res.status(500).json({ 
//             error: "Error adding terrace tags",
//             message: process.env.NODE_ENV === 'development' 
//                 ? error.message 
//                 : undefined
//         });
//     }
// };


// http://localhost:8080/terraces/id/tags
// GET items/:id/tags
export const getTerraceTags = async (req: Request, res: Response) => {
    const terraceID = req.params.id;

    if (!terraceID) {
        return res.status(400).json({ error: "Invalid or inexistent terrace ID" });
    }

    try {
        const terrace = await Terrace.findByPk(terraceID, {
            attributes: ['tags']
        });

        if (!terrace) {
            return res.status(404).json({ error: "Terrace not found" });
        }

        res.status(200).json({
            terraceId: terraceID,
            tags: terrace.tags || {}
        });

    } catch (error: any) {
        console.error(`Error fetching tags for terrace ${terraceID}:`, error);

        return res.status(500).json({
            error: "Internal server error",
            message: process.env.NODE_ENV === 'development'
                ? error.message
                : 'Failed to fetch tags'
        });
    }
};

// http://localhost:8080/terraces/id/tags
// PUT /terraces/:id/tags
// export const updateTerraceTags = async (req: Request, res: Response) => {
//     const terraceID = req.params.id;
//     // Expects this structure --> { tags: { category: [tags] } }
//     const { tags: tagUpdates } = req.body;

//     if (!terraceID) {
//         return res.status(400).json({ error: "Invalid or nonexistent terrace ID" });
//     }

//     if (!tagUpdates || typeof tagUpdates !== 'object' || Object.keys(tagUpdates).length === 0) {
//         return res.status(400).json({
//             error: "No valid tags data provided",
//             hint: "Expected format: { tags: { category: [tag1, tag2] } }"
//         });
//     }

//     try {
//         const terrace = await Terrace.findByPk(terraceID);
//         if (!terrace) {
//             return res.status(404).json({ error: "Terrace not found" });
//         }

//         const currentTags: Record<string, string[]> = terrace.tags || {};
//         const updatedTags: Record<string, string[]> = { ...currentTags };

//         for (const [category, tags] of Object.entries(tagUpdates)) {
//             if (!Array.isArray(tags)) {
//                 return res.status(400).json({
//                     error: `Invalid tags format for category '${category}'`,
//                     details: "Expected an array of strings"
//                 });
//             }

//             updatedTags[category as string] = [
//                 ...new Set([
//                     ...(currentTags[category as string] || []),
//                     ...tags
//                 ])
//             ];
//         }

//         const [updatedRows] = await Terrace.update(
//             { tags: updatedTags },
//             { where: { id: terraceID } }
//         );

//         if (updatedRows === 0) {
//             return res.status(500).json({ error: "Tags update failed unexpectedly, no rows to update" });
//         }

//         res.status(200).json({
//             message: "Tags updated successfully",
//             terraceID,
//             updatedTags,
//             updatedCategories: Object.keys(tagUpdates)
//         });

//     } catch (error: any) {
//         console.error(`Error updating tags for terrace ${terraceID}:`, error);

//         return res.status(500).json({
//             error: "Internal server error",
//             message: process.env.NODE_ENV === 'development'
//                 ? error.message
//                 : "Failed to update tags"
//         });
//     }
// };

// http://localhost:8080/terraces/:id/tags
// PUT /terraces/:id/tags


export const upsertTerraceTags = async (req: Request, res: Response) => {
    const terraceID = req.params.id;
    const { tags: tagUpdates } = req.body;

    if (!terraceID) {
        return res.status(400).json({ error: "Invalid terrace ID" });
    }

    if (!tagUpdates || typeof tagUpdates !== 'object') {
        return res.status(400).json({
            error: "Invalid tags format",
            hint: "Expected: { tags: { category: [tag1, tag2] } }"
        });
    }

    try {
        const terrace = await Terrace.findByPk(terraceID);
        if (!terrace) {
            return res.status(404).json({ error: "Terrace not found" });
        }

        const currentTags: Record<string, string[]> = terrace.tags || {};
        const updatedTags: Record<string, string[]> = { ...currentTags };
        const operationResults: string[] = [];

        for (const [category, tags] of Object.entries(tagUpdates)) {
            if (!Array.isArray(tags)) {
                return res.status(400).json({
                    error: `Invalid tags format for '${category}'`,
                    details: "Expected array of strings"
                });
            }

            const isNewCategory = !currentTags[category];
            updatedTags[category] = [
                ...new Set([
                    ...(currentTags[category] || []),
                    ...tags.filter(t => typeof t === 'string')
                ])
            ];

            operationResults.push(
                isNewCategory 
                    ? `Created category '${category}'` 
                    : `Updated category '${category}'`
            );
        }

        await terrace.update({ tags: updatedTags });

        return res.status(200).json({
            success: true,
            terraceID,
            operations: operationResults,
            tags: updatedTags,
            changes: Object.keys(tagUpdates).length
        });

    } catch (error: any) {
        console.error(`Error upserting tags for terrace ${terraceID}:`, error);
        
        return res.status(500).json({
            error: "Tags operation failed",
            details: process.env.NODE_ENV === 'development'
                ? error.message
                : undefined,
            ...(error.errors && { validationErrors: error.errors })
        });
    }
};


// http://localhost:8080/terraces/:id/tags
// DELETE items/:id/tags
export const deleteTerraceTags = async (req: Request, res: Response) => {
    const terraceID = req.params.id;

    if (!terraceID) {
        return res.status(400).json({ error: "Invalid or inexistent terrace ID" });
    }

    try {
        const terrace = await Terrace.findByPk(terraceID);

        if (!terrace) {
            return res.status(404).json({ error: "Terrace not found" });
        }

        // Clearing the tags by resetting them to an empty object {}
        await terrace.update({ tags: {} });
        
        res.sendStatus(200);

    } catch (error: any) {
        console.error(`Error deleting tags for terrace ID-${terraceID}: ${error}`);
        
        console.error(`❌ Error deleting terrace tags:`, error);
        return res.status(500).json({ 
            error: "Error deleting terrace tags",
            message: process.env.NODE_ENV === 'development' 
                ? error.message 
                : undefined
        });
    }
};