import { readFile } from "fs/promises";
import path from "path";

export const readJsonArray = async <T>(filePath: string): Promise<T[]> => {
    const absolutePath = path.resolve(filePath);
    const fileContent = await readFile(absolutePath, "utf-8");
    return JSON.parse(fileContent);
};