import { Meta } from '@storybook/addon-docs';
import { JSONOutput, ReflectionKind } from 'typedoc';

type ArgTypes = NonNullable<Parameters<typeof Meta>[0]['argTypes']>;

export function getMeta(node: JSONOutput.DeclarationReflection, path: string) {
  const content: string[] = [];

  content.push(`title="${path}${node.name}"`);

  if (node.signatures?.length) {
    const argTypes: ArgTypes = {};

    for (const signature of node.signatures) {
      if (signature.kind === ReflectionKind.CallSignature) {
        if (signature.parameters) {
          const details: NonNullable<ArgTypes[string]> = {};

          for (const param of signature.parameters) {
            let name = param.name;

            if (param.flags.isRest) {
              name = '...' + name;
            }

            if (param.flags.isOptional) {
              name = name + '?';
            }

            if (param.comment) {
              details['description'] = param.comment.summary.map((s) => s.text).join('\n');
            }

            if (param.type) {
              switch (param.type.type) {
                case 'intrinsic': {
                  details['type'] = { name: 'other', value: param.type.name };
                  break;
                }
                case 'reference': {
                  details['name'] = param.type.name;
                  break;
                }
              }
            }

            argTypes[name] = details;
          }
        }
      }
    }

    if (Object.keys(argTypes).length) {
      content.push(`component={function Foo() {}}`);
      content.push(`argTypes={${JSON.stringify(argTypes)}}`);
    }
  }

  return `<Meta ${content.join(' ')} />`;
}
