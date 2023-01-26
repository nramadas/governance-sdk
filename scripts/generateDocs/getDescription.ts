import { JSONOutput, ReflectionKind } from 'typedoc';

const CODE_TAGS = new Set(['@example']);

function tagToTitle(tag: string) {
  const withoutSymbol = tag.replace('@', '');
  return withoutSymbol[0].toUpperCase() + withoutSymbol.slice(1);
}

function groupTags(tags: JSONOutput.CommentTag[]) {
  const code: JSONOutput.CommentTag[] = [];
  const other: JSONOutput.CommentTag[] = [];

  for (const tag of tags) {
    if (CODE_TAGS.has(tag.tag)) {
      code.push(tag);
    } else {
      other.push(tag);
    }
  }

  return { code, other };
}

function buildContent(content: JSONOutput.CommentDisplayPart[]) {
  return content.map((part) => part.text).join('\n');
}

export function getDescription(node: JSONOutput.DeclarationReflection) {
  let description = '';
  let comment: JSONOutput.CommentDisplayPart[] = [];
  let blockTags: JSONOutput.CommentTag[] = [];

  if (node.comment) {
    comment = comment.concat(node.comment.summary);

    if (node.comment.blockTags) {
      blockTags = blockTags.concat(node.comment.blockTags);
    }
  } else if (node.signatures?.length) {
    for (const signature of node.signatures) {
      if (signature.kind === ReflectionKind.CallSignature) {
        if (signature.comment) {
          comment = comment.concat(signature.comment.summary);

          if (signature.comment.blockTags) {
            blockTags = blockTags.concat(signature.comment.blockTags);
          }
        }
      }
    }
  }

  if (comment.length) {
    description += buildContent(comment) + '\n';
  }

  if (blockTags.length) {
    const { code, other } = groupTags(blockTags);

    if (other.length) {
      description += '\n| Info | |\n|---|---|\n';

      for (const blockTag of other) {
        description += `| ${blockTag.name || blockTag.tag} | ${buildContent(blockTag.content)} |\n`;
      }
    }

    if (code.length) {
      description += '\n';

      for (const blockTag of code) {
        description += `## ${tagToTitle(blockTag.name || blockTag.tag)}\n`;
        description += buildContent(blockTag.content) + '\n';
      }
    }

    description += '\n';
  }

  return description;
}
