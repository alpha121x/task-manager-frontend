// codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'schema.graphql',
  documents: 'src/**/*.vue',
  generates: {
    'src/utils/types/graphql.ts': {
      plugins: ['typescript', 'typescript-urql']
    }
  }
}

export default config