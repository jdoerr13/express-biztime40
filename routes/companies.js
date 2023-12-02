const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res, next) => {
    try {
      const results = await db.query(`SELECT * FROM companies`);
      return res.json({ companies: results.rows })//THE RESULTS OBJ IN  pg WILL TYPICALLY CONTAIN A PROPERTY NAMED ROWS
    } catch (e) {
      return next(e);
    }
  })
  router.get('/:code', async (req, res, next) => {
    try {
      const { code } = req.params;
  
      // company information
      const companyResult = await db.query('SELECT * FROM companies WHERE code = $1', [code]);
  
      if (companyResult.rows.length === 0) {
        throw new ExpressError(`Company not found: ${code}`, 404);
      }
  
      const company = companyResult.rows[0];
  
      // Fetch invoices associated with the company
      const invoicesResult = await db.query('SELECT id FROM invoices WHERE comp_code = $1', [code]);
      const invoices = invoicesResult.rows.map(row => row.id);
  
      // response object
      const response = {
        company: {
          code: company.code,
          name: company.name,
          invoices: invoices,
        },
      };
  
      return res.json(response);
    } catch (e) {
      return next(e);
    }
  });

//   router.get('/:code', async (req, res, next) => {
//     try {
//       const { code } = req.params;
//       const results = await db.query('SELECT * FROM companies WHERE code = $1', [code])
  
//       if (results.rows.length === 0) {//CHECK IF NOTHING IS FOUND FIRST(ERROR FIRST)
//         throw new ExpressError(`Can't find user with id of ${code}`, 404)
//       }
//       return res.send({ company: results.rows[0] })
//     } catch (e) {
//       return next(e)
//     }
//   })

  router.post('/', async (req, res, next) => {
    try {
      const { code, name, description } = req.body;
      const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description]);
      // console.log(results)
      // return res.json(results.rows)
      return res.status(201).json({ company: results.rows[0] })//201 MEAN CREATED
    } catch (e) {
      return next(e)
    }
  })

  router.put('/:code', async (req, res, next) => {
    try {
      const { name, description } = req.body;
      const { code } = req.params;

      const results = await db.query(
        'UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING code, name, description',
        [name, description, code])
    if (results.rows.length === 0) {
            throw new ExpressError(`Company not found`, 404);
           }
  
      return res.json({ "company": results.rows[0] });

    } catch (e) {
      return next(e);
    }
  });

  router.delete('/:code', async (req, res, next) => {
    try {
      const results = db.query('DELETE FROM companies WHERE code = $1', [req.params.code])//could pull this out and destructure it like above, but not necessary!
      return res.send({ msg: "DELETED!" })
    } catch (e) {
      return next(e)
    }
  })


  module.exports = router;