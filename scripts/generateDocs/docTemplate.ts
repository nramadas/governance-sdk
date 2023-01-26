interface Args {
  path: string;
  name: string;
  description: string;
  meta: string;
}

export const docTemplate = (args: Args) =>
  `
import { Meta } from '@storybook/addon-docs';

${args.meta}

# ${args.name}

${args.description}
`.trim();
