/**
 * dataService.js
 * -----------------------------------------------------------------------
 * Single source of truth for all cafe business data (menu, hours, contact,
 * FAQs, offers, ambience, etc).
 *
 * Today this reads/writes a local JSON file so the project works out of
 * the box with zero database setup. Every function here is intentionally
 * isolated so that later you can swap the file-based storage for MongoDB,
 * PostgreSQL, Firebase, etc. WITHOUT changing any other part of the app -
 * just rewrite the functions below to talk to your real database.
 * -----------------------------------------------------------------------
 */

const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "cafeData.json");

function readData() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  return data;
}

function getCafeData() {
  return readData();
}

function updateCafeData(partialUpdate) {
  const current = readData();
  const merged = deepMerge(current, partialUpdate);
  return writeData(merged);
}

function replaceCafeData(newData) {
  return writeData(newData);
}

// Simple deep merge so admin can send partial updates (e.g. just "hours")
function deepMerge(target, source) {
  if (typeof target !== "object" || target === null) return source;
  if (typeof source !== "object" || source === null) return source;
  if (Array.isArray(source)) return source; // arrays are replaced wholesale

  const result = { ...target };
  for (const key of Object.keys(source)) {
    result[key] = deepMerge(target[key], source[key]);
  }
  return result;
}

module.exports = {
  getCafeData,
  updateCafeData,
  replaceCafeData,
};
