import { IState } from '../types';
import { replaceHandlebars } from '../utils';
import * as fs from 'fs';
import * as path from 'path';

export class OutputService {
  generateOutputPath(outPathTemplate: string, state: IState): string {
    return replaceHandlebars(outPathTemplate, state);
  }

  async saveOutputToFile(outputPath: string, result: string): Promise<void> {
    const directoryPath = path.dirname(outputPath);

    // Ensure the directory exists
    await fs.promises.mkdir(directoryPath, { recursive: true });

    // Write the output to the specified path
    await fs.promises.writeFile(outputPath, result, 'utf8');
  }
}
