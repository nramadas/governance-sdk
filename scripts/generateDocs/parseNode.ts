import { JSONOutput, ReflectionKind } from 'typedoc';

import { buildDocsForNode, Docs } from './buildDocsForNode';

export function parseNode(node: JSONOutput.DeclarationReflection, path = ''): Docs[] {
  if (node.kind === ReflectionKind.Module || node.kind === ReflectionKind.Namespace) {
    if (node.children?.length) {
      return node.children.map((child) => parseNode(child, path + node.name + '/')).flat();
    }

    return [];
  }

  return [buildDocsForNode({ path, node })];
}
