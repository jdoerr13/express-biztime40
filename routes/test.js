process.env.NODE_ENV = 'test';//NEED TO DO THIS BEFORE THE REQURE../DB

const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testInvoice;
beforeEach(async () => {
  // Insert a company into the "companies" table
  await db.query(`
    INSERT INTO companies (code, name, description)
    VALUES ('ibm', 'IBM Corporation', 'Description of IBM')
    RETURNING code, name, description
  `);
  // Insert an invoice into the "invoices" table
  const result = await db.query(`
    INSERT INTO invoices (comp_code, amt)
    VALUES ('ibm', 100)
    RETURNING id, comp_code, amt, paid, add_date, paid_date
  `);
  testInvoice = result.rows[0];
});

afterEach(async () => {
  await db.query(`DELETE FROM invoices`);
  await db.query(`DELETE FROM companies`);
});

afterAll(async () => {
  await db.end();
});

describe("GET /invoices", () => {
  test("Get a list with one invoice", async () => {
    const res = await request(app).get('/invoices');
    expect(res.statusCode).toBe(200);
    testInvoice.add_date = testInvoice.add_date.toISOString();
    expect(res.body.invoices).toContainEqual(testInvoice);
    //   [{
    //     add_date: "2023-12-02T05:00:00.000Z",
    //     amt: 100,
    //     comp_code: "ibm",
    //     id: expect.any(Number),
    //     paid: false,
    //     paid_date: null,
    //   }
    // ]
  });
  });

  describe("POST /invoices", () => {
    test("Creates a single invoice", async () => {
      const res = await request(app).post('/invoices').send({ comp_code: 'ibm', amt: 500 });
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        invoice: { id: expect.any(Number), comp_code: 'ibm', amt: 500, paid: false, add_date: expect.any(String), paid_date: null }
      });
    });
  });

describe("PUT /invoices/:id", () => {
  test("Updates a single invoice", async () => {
    const res = await request(app).put(`/invoices/${testInvoice.id}`).send({ amt: 200, paid: true });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      invoice: { id: testInvoice.id, comp_code: 'ibm', amt: 200, paid: true, add_date: expect.any(String), paid_date: expect.any(String) }
    });
  });

  test("Responds with 404 for invalid id", async () => {
    const res = await request(app).put(`/invoices/0`).send({ amt: 200, paid: true });
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /invoices/:id", () => {
  test("Deletes a single invoice", async () => {
    const res = await request(app).delete(`/invoices/${testInvoice.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'DELETED!' });
  });
});