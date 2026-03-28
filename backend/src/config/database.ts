import BetterSqlite3 from 'better-sqlite3';
import path from 'path';
import { env } from './env';
import { schema } from './schema';

const resolvedDbPath = path.isAbsolute(env.dbPath)
  ? env.dbPath
  : path.resolve(process.cwd(), env.dbPath);

const db: BetterSqlite3.Database = new BetterSqlite3(resolvedDbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(schema);

export default db;
