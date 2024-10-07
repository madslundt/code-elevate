import fs from 'fs/promises';
import path from 'path';

export const getLocalDependencies = async (fileContent: string, filePath: string, workspaceFolderPath: string): Promise<Record<string, string>> => {
    const dependencies: Record<string, string> = {};
    const importRegex = /(?:import|require)\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    const importStatementRegex = /(?:import|require)\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

    let match: RegExpExecArray | null;
    while ((match = importRegex.exec(fileContent)) !== null || (match = importStatementRegex.exec(fileContent)) !== null) {
        const importPath = match[1];
        if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
            continue;
        }
        const absolutePath = path.resolve(path.dirname(filePath), importPath);
        const relativePath = path.relative(workspaceFolderPath, absolutePath);

        try {
            const depContent: string = await fs.readFile(absolutePath, 'utf-8');
            dependencies[relativePath] = depContent;

            const nestedDeps = await getLocalDependencies(depContent, absolutePath, workspaceFolderPath);
            Object.assign(dependencies, nestedDeps);
        } catch (error) {
            console.error(`Error reading file ${absolutePath}: ${error}`);
        }
    }

    return dependencies;
};
