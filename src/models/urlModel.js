import db from "../config/database.js";

export const save = (shortCode, longUrl) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO urls (shortCode, longUrl) VALUES (?, ?)",
      [shortCode, longUrl],
      function (err) {
        if (err) reject(err);
        else resolve({ shortCode, longUrl });
      },
    );
  });
};

export const findByCode = (shortCode) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT longUrl FROM urls WHERE shortCode = ?",
      [shortCode],
      (err, row) => {
        if (err) reject(err);
        else resolve(row); // returns undefined if not found
      },
    );
  });
};

export const exists = (shortCode) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT shortCode FROM urls WHERE shortCode = ?",
      [shortCode],
      (err, row) => {
        if (err) reject(err);
        else resolve(!!row); // returns true if found, false if not
      },
    );
  });
};
