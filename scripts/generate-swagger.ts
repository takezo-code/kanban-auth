import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { swaggerSpec } from '../src/shared/config/swagger';

const outputDir = path.join(process.cwd(), 'docs');
const jsonPath = path.join(outputDir, 'openapi.json');
const yamlPath = path.join(outputDir, 'openapi.yaml');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(jsonPath, JSON.stringify(swaggerSpec, null, 2), 'utf-8');
console.log(`✅ OpenAPI JSON gerado em: ${jsonPath}`);

fs.writeFileSync(yamlPath, yaml.dump(swaggerSpec), 'utf-8');
console.log(`✅ OpenAPI YAML gerado em: ${yamlPath}`);

