import { JSONOutput } from 'typedoc';

import { docTemplate } from './docTemplate';
import { getDescription } from './getDescription';
import { getMeta } from './getMeta';

interface Args {
  path: string;
  node: JSONOutput.DeclarationReflection;
}

export interface Docs {
  filename: string;
  content: string;
}

export function buildDocsForNode(args: Args): Docs {
  const content = docTemplate({
    path: args.path,
    name: args.node.name,
    description: getDescription(args.node),
    meta: getMeta(args.node, args.path),
  });
  const path = args.path + args.node.name;
  // @ts-ignore
  const filename = path.replaceAll('/', '-') + '.stories.mdx';

  return {
    filename,
    content,
  };
}
