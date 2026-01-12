import Terrace from "../../models/terrace-model/db/terrace-model-sequelize.js";

export const updateTerraceTags = async (
    terraceId: string,
    newTags: Record<string, string[]>, // New tags to add (format: { "category": ["tag1", "tag2"] })
) => {

    const terrace = await Terrace.findByPk(terraceId);
    if (!terrace) throw new Error('Terrace not found');

    const currentTags: Record<string, string[]> = terrace.tags || {};

    const updatedTags = { ...currentTags };

    for (const category in newTags) {
        updatedTags[category as string] = [
            ...new Set([
                ...(currentTags[category] || []),
                ...newTags[category]
            ])
        ];
    }

    await terrace.update({ tags: updatedTags });

    return updatedTags;
};