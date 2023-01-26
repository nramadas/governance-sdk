import * as path from 'path';

import * as TypeDoc from 'typedoc';

export function createJson() {
  const app = new TypeDoc.Application();
  app.options.addReader(new TypeDoc.TSConfigReader());
  app.options.addReader(new TypeDoc.TypeDocReader());

  app.bootstrap({
    entryPoints: [path.resolve('packages/**/*.{ts,tsx}')],
    entryPointStrategy: 'packages',
  });

  const project = app.convert();

  if (!project) {
    throw new Error('Could not build typedoc project');
  }

  app.generateDocs(project, './docs');

  return app.serializer.projectToObject(project);
}
