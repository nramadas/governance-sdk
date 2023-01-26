import { promises as fs } from 'fs';
import * as path from 'path';

import { createJson } from './createJson';
import { parseNode } from './parseNode';

const OUTPUTDIR = 'docs';

async function main() {
  const json = createJson();

  if (json) {
    const children = json.children;

    if (children) {
      await fs.mkdir(OUTPUTDIR);
      const docs = children.map((child) => parseNode(child)).flat();

      for (const doc of docs) {
        fs.writeFile(path.resolve(OUTPUTDIR, doc.filename), doc.content);
      }
    }
  }
}

main().catch(console.error);
