const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'sales_bi.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('Clearing database tables...');
  db.run(`DELETE FROM sales`, (err) => {
    if (err) console.error('Error clearing sales:', err.message);
    else console.log('Cleared sales table.');
  });
  db.run(`DELETE FROM products`, (err) => {
    if (err) console.error('Error clearing products:', err.message);
    else console.log('Cleared products table.');
  });
  db.run(`DELETE FROM regions`, (err) => {
    if (err) console.error('Error clearing regions:', err.message);
    else console.log('Cleared regions table.');
  });
  db.run(`DELETE FROM customers`, (err) => {
    if (err) console.error('Error clearing customers:', err.message);
    else console.log('Cleared customers table.');
  });
});

db.close((err) => {
  if (err) console.error(err.message);
  console.log('Database connection closed.');
});
