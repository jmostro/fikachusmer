import Database from "better-sqlite3";

const db = new Database("database.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player TEXT,
    activity TEXT,
    timestamp INTEGER
  );
`);

export function logActivity(player: string, activity: string) {
  db.prepare("INSERT INTO logs (player, activity, timestamp) VALUES (?, ?, ?)").run(
    player,
    activity,
    Date.now()
  );
}

export function getLogs() {
  return db.prepare("SELECT * FROM logs ORDER BY timestamp DESC").all();
}
