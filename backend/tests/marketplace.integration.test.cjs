const assert = require('node:assert/strict');
const { randomUUID, randomBytes } = require('node:crypto');
const { test } = require('node:test');

const databaseUrl = process.env.TEST_DATABASE_URL;
if (!databaseUrl) {
  throw new Error('TEST_DATABASE_URL must point to a dedicated local unissential_test database');
}
const database = new URL(databaseUrl);
if (
  !['postgres:', 'postgresql:'].includes(database.protocol) ||
  !['localhost', '127.0.0.1', '[::1]'].includes(database.hostname) ||
  !/^unissential_test(?:_[a-z0-9_]+)?$/.test(database.pathname.slice(1))
) {
  throw new Error('TEST_DATABASE_URL must use localhost and a database named unissential_test');
}

process.env.DATABASE_URL = databaseUrl;
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = randomBytes(32).toString('hex');
require('../dist/register-paths');
const app = require('../dist/app').default;
const prisma = require('../dist/config/database').default;
const { generateToken } = require('../dist/utils/auth');

test('marketplace CRUD, pagination, privacy and saved products enforce ownership', async () => {
  const marker = randomUUID();
  const users = [];
  let server;
  try {
    for (const name of ['Seller', 'Buyer', 'Other']) {
      users.push(await prisma.user.create({
        data: {
          email: `${marker}-${name.toLowerCase()}@example.edu`,
          name,
          password: 'test-password-hash',
          university: 'Test University',
          isVerified: true,
        },
      }));
    }

    server = await new Promise((resolve) => {
      const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
    });
    const base = `http://127.0.0.1:${server.address().port}/api/marketplace`;
    const tokens = users.map((user) => generateToken({ userId: user.id, email: user.email }));

    async function request(path, method = 'GET', token, body) {
      const response = await fetch(`${base}${path}`, {
        method,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
      return { status: response.status, body: await response.json() };
    }

    const payload = {
      title: `Test product ${marker}`,
      description: 'An isolated marketplace test product',
      price: 42.5,
      location: 'Test town',
      category: 'textbooks',
      condition: 'good',
      images: ['https://example.com/product.jpg'],
    };

    assert.equal((await request('', 'POST', undefined, payload)).status, 401);
    const created = await request('', 'POST', tokens[0], payload);
    assert.equal(created.status, 201);
    const productId = created.body.data.id;
    assert.deepEqual(Object.keys(created.body.data.seller).sort(), ['id', 'isVerified', 'name', 'profilePicture']);

    const list = await request(`?search=${marker}&page=1&limit=1&minPrice=42.4&maxPrice=42.6`);
    assert.equal(list.status, 200);
    assert.equal(list.body.data[0].id, productId);
    assert.deepEqual(list.body.pagination, { page: 1, limit: 1, total: 1, pages: 1 });
    assert.equal('email' in list.body.data[0].seller, false);
    const second = await request('', 'POST', tokens[0], {
      ...payload,
      title: `Second product ${marker}`,
      price: 50,
    });
    assert.equal(second.status, 201);
    const firstPage = await request(`?search=${marker}&page=1&limit=1&sort=price-asc`);
    const secondPage = await request(`?search=${marker}&page=2&limit=1&sort=price-asc`);
    assert.deepEqual(firstPage.body.pagination, { page: 1, limit: 1, total: 2, pages: 2 });
    assert.equal(firstPage.body.data[0].id, productId);
    assert.equal(secondPage.body.data[0].id, second.body.data.id);
    const detail = await request(`/${productId}`);
    assert.equal(detail.status, 200);
    assert.equal(detail.body.data.id, productId);
    assert.equal('email' in detail.body.data.seller, false);

    for (const query of ['page=0', 'page=-1', 'page=1x', 'page=1000001', 'limit=101', 'limit=1.5', 'limit=1&limit=2']) {
      assert.equal((await request(`?${query}`)).status, 400, query);
    }
    assert.equal((await request('/saved')).status, 401);
    assert.equal((await request('/saved?limit=101', 'GET', tokens[1])).status, 400);
    assert.equal((await request(`/${productId}/saved`)).status, 401);
    assert.equal((await request(`/${productId}/save`, 'POST')).status, 401);
    assert.equal((await request(`/${productId}/save`, 'DELETE')).status, 401);
    assert.equal((await request(`/${productId}`, 'PUT', undefined, { title: 'Updated title' })).status, 401);
    assert.equal((await request(`/${productId}/sold`, 'PATCH')).status, 401);
    assert.equal((await request(`/${productId}`, 'DELETE')).status, 401);

    assert.equal((await request(`/${productId}`, 'PUT', tokens[1], { title: 'Updated title' })).status, 403);
    assert.equal((await request(`/${productId}/sold`, 'PATCH', tokens[1])).status, 403);
    assert.equal((await request(`/${productId}`, 'DELETE', tokens[1])).status, 403);
    const updated = await request(`/${productId}`, 'PUT', tokens[0], { title: `Updated ${marker}` });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.data.title, `Updated ${marker}`);

    assert.equal((await request(`/${productId}/save`, 'POST', tokens[1])).status, 200);
    assert.equal((await request(`/${productId}/saved`, 'GET', tokens[1])).body.data.isSaved, true);
    assert.equal((await request(`/${productId}/saved`, 'GET', tokens[2])).body.data.isSaved, false);
    const saved = await request('/saved', 'GET', tokens[1]);
    assert.equal(saved.status, 200);
    assert.deepEqual(saved.body.data.map((product) => product.id), [productId]);
    assert.equal('email' in saved.body.data[0].seller, false);
    assert.deepEqual((await request('/saved', 'GET', tokens[2])).body.data, []);
    assert.equal((await request(`/${productId}/save`, 'DELETE', tokens[2])).status, 200);
    assert.equal((await request(`/${productId}/saved`, 'GET', tokens[1])).body.data.isSaved, true);
    assert.equal((await request(`/${productId}/save`, 'DELETE', tokens[1])).status, 200);
    assert.equal((await request(`/${productId}/saved`, 'GET', tokens[1])).body.data.isSaved, false);

    assert.equal((await request(`/${productId}/sold`, 'PATCH', tokens[0])).body.data.isAvailable, false);
    assert.equal((await request(`/${productId}`, 'DELETE', tokens[0])).status, 200);
    assert.equal((await request(`/${productId}`)).status, 404);
  } finally {
    if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    if (users.length) await prisma.user.deleteMany({ where: { id: { in: users.map((user) => user.id) } } });
    await prisma.$disconnect();
  }
});
