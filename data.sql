DROP DATABASE IF EXISTS biztime;

CREATE DATABASE biztime;

\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);
--comp_code column in the invoices table is a foreign key that references the code column in the companies table. Specifically, it references the code column in the companies table, and the ON DELETE CASCADE means that if a company with a certain code is deleted, all corresponding invoices with the matching comp_code will also be deleted.
CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

-- Add the industries table
CREATE TABLE industries (
    code text PRIMARY KEY,
    industry text NOT NULL UNIQUE
);

-- Add the join table for the many-to-many relationship
CREATE TABLE company_industry (
    company_code text REFERENCES companies ON DELETE CASCADE,
    industry_code text REFERENCES industries ON DELETE CASCADE,
    PRIMARY KEY (company_code, industry_code)
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);


INSERT INTO industries (code, industry) VALUES ('acct', 'Accounting');
INSERT INTO industries (code, industry) VALUES ('tech', 'Technology');

INSERT INTO company_industry (company_code, industry_code) VALUES ('ibm', 'tech');
INSERT INTO company_industry (company_code, industry_code) VALUES ('apple', 'tech');
