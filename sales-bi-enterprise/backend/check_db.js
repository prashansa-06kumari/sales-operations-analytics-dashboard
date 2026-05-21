const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'sales_bi.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='users';", (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Tables found:', rows);
    }
    db.close();
  });
});
