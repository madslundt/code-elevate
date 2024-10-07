import { IState } from '../types';
import { replaceHandlebars } from '../utils';
import fs from 'fs/promises';
import path from 'path';

export class OutputService {
  generateOutputPath(outPathTemplate: string, state: IState): string {
    return replaceHandlebars(outPathTemplate, state);
  }

  async saveOutputToFile(outputPath: string, result: string): Promise<void> {
    const directoryPath = path.dirname(outputPath);

    // Ensure the directory exists
    await fs.mkdir(directoryPath, { recursive: true });

    // Write the output to the specified path
    await fs.writeFile(outputPath, result, 'utf-8');
  }
}
