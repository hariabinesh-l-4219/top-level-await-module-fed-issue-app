import { createModuleFederationConfig } from '@module-federation/enhanced/rspack';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
const deps = packageJson.dependencies;

export default createModuleFederationConfig({
     name: 'app1',
    library: { type: 'var', name: 'app1' },
    remotes: {
      app2: 'app2',
    },
    shared: {
      ...deps,
      'react-dom': {
        import: 'react-dom', // the "react" package will be used a provided and fallback module
        shareKey: 'react-dom', // under this name the shared module will be placed in the share scope
        singleton: true, // only a single version of the shared module is allowed
      },
    },
  });