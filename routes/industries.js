const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");


router.get('/', async (req, res, next) => {
    try {//select all industry columns, and the company_industry row: company_code, where the code column in industries matches the industry_code in company_industries
        //array_agg aggregates the associated companies into a arr
      const results = await db.query(`SELECT i.*, array_agg(ci.company_code) AS company_codes FROM industries i LEFT JOIN company_industry ci ON i.code = ci.industry_code GROUP BY i.code`);//with i.* & array_agg, you MUST use GROUP BY
      return res.json({ industries: results.rows })
    } catch (e) {
      return next(e);
    }
  })

// Add industry
router.post('/', async (req, res, next) => {
    try {
      const { code, industry } = req.body;
      const result = await db.query('INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry', [code, industry]);
      return res.status(201).json({ industry: result.rows[0] });
    } catch (e) {
      return next(e);
    }
  });


// // Associate an industry with a company
router.post('/company_industry', async (req, res, next) => {
    try {
      // Assuming you're passing the company_code and industry_code in the request body
      const { company_code, industry_code } = req.body;
  
      await db.query(
        'INSERT INTO company_industry (company_code, industry_code) VALUES ($1, $2) RETURNING company_code, industry_code',
        [company_code, industry_code]
      );
  
      return res.status(201).json({ message: 'Association created successfully' });
    } catch (e) {
      return next(e);
    }
  });
  

module.exports = router;