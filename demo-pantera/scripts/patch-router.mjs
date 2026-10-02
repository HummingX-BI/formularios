import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src');

const routerPath = path.join(srcDir, 'app', 'router.tsx');
let routerContent = fs.readFileSync(routerPath, 'utf8');
if (!routerContent.includes('_data-audit')) {
  routerContent = routerContent.replace(
    "import { NotFoundPage } from '@/ui/NotFoundPage';",
    "import { NotFoundPage } from '@/ui/NotFoundPage';\nimport DataAuditPage from '@/modules/system/DataAuditPage';"
  );
  routerContent = routerContent.replace(
    "<Route path=\"*\" element={<NotFoundPage />} />",
    "<Route path=\"_data-audit\" element={<DataAuditPage />} />\n          <Route path=\"*\" element={<NotFoundPage />} />"
  );
  fs.writeFileSync(routerPath, routerContent);
  console.log('Router patched.');
} else {
  console.log('Router already patched.');
}
