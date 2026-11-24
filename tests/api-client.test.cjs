const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const ts = require('typescript');

const clientPath = path.join(__dirname, '..', 'src', 'services', 'api', 'client.ts');
const source = fs.readFileSync(clientPath, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const clientModule = new Module(clientPath, module);
clientModule.filename = clientPath;
clientModule.paths = Module._nodeModulePaths(path.dirname(clientPath));
clientModule._compile(compiled, clientPath);
const { apiCall } = clientModule.exports;

test('apiCall preserves Express pagination metadata', async (t) => {
  const originalFetch = global.fetch;
  t.after(() => {
    global.fetch = originalFetch;
  });
  const pagination = { page: 2, limit: 12, total: 25, pages: 3 };
  global.fetch = async () => ({
    ok: true,
    json: async () => ({ success: true, data: [{ id: 'product-1' }], pagination }),
  });

  const result = await apiCall('/marketplace?page=2&limit=12');

  assert.deepEqual(result, { success: true, data: [{ id: 'product-1' }], pagination });
});

test('apiCall keeps non-paginated response data unchanged', async (t) => {
  const originalFetch = global.fetch;
  t.after(() => {
    global.fetch = originalFetch;
  });
  const data = { id: 'product-1', title: 'Desk lamp' };
  global.fetch = async () => ({
    ok: true,
    json: async () => ({ success: true, data }),
  });

  const result = await apiCall('/marketplace/product-1');

  assert.deepEqual(result, { success: true, data, pagination: undefined });
});
