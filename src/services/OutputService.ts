import { IState } from '../types';
import { replaceHandlebars } from '../utils';
import fs from 'fs/promises';
import path from 'path';

export class OutputService {
  generateOutputPath(outPathTemplate: string, state: IState): string {
    const filePath = path.join(state.workspaceFolderPath, state.filePath, replaceHandlebars(state, outPathTemplate));
    return filePath;
  }

  async saveOutputToFile(outputPath: string, result: string): Promise<void> {
    const directoryPath = path.dirname(outputPath);

    let content = result;
    if (typeof result === 'object') {
      content = JSON.stringify(result, null, 2);
    }

    // Ensure the directory exists
    await fs.mkdir(directoryPath, { recursive: true });

    // Write the output to the specified path
    await fs.writeFile(outputPath, content, 'utf-8');
  }
}
