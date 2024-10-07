import fs from 'fs/promises';
import path from 'path';
import { getLocalDependencies } from './getLocalDependencies';

export const getFileContent = async (filePath: string, workspaceFolderPath: string): Promise<string> => {
    const fileContent: string = await fs.readFile(filePath, 'utf-8');
    const dependencies = await getLocalDependencies(fileContent, filePath, workspaceFolderPath);

    const relativePath = path.relative(workspaceFolderPath, filePath);

    let context = `// ${relativePath}\n\n${fileContent}\n\n`;

    for (const [depPath, depContent] of Object.entries(dependencies)) {
        const depRelativePath = path.relative(workspaceFolderPath, depPath);
        context += `// ${depRelativePath}\n\n${depContent}\n\n`;
    }

    return context;
};
