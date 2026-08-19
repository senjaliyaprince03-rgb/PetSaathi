import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class EvaluationDataset {
  constructor() {
    this.dataDir = path.join(__dirname, 'data');
    this.datasets = {};
  }

  async load() {
    const files = await fs.readdir(this.dataDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const name = path.basename(file, '.json');
        const content = await fs.readFile(path.join(this.dataDir, file), 'utf-8');
        this.datasets[name] = JSON.parse(content);
      }
    }
  }

  get(name) {
    return this.datasets[name] || [];
  }
}
