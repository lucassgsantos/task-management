import { v4 as uuidv4 } from 'uuid';
import db from '../config/database';
import { PublicUser, UserRecord } from '../models/User';

interface UserRow {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

interface PublicUserRow {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

const mapUserRow = (row: UserRow): UserRecord => {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const mapPublicUserRow = (row: PublicUserRow): PublicUser => {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at,
  };
};

export const userRepository = {
  findByEmail(email: string) {
    const row = db
      .prepare(
        `
          SELECT id, email, name, password_hash, created_at, updated_at
          FROM users
          WHERE email = ?
        `,
      )
      .get(email) as UserRow | undefined;

    return row ? mapUserRow(row) : undefined;
  },

  findPublicById(id: string) {
    const row = db
      .prepare(
        `
          SELECT id, email, name, created_at
          FROM users
          WHERE id = ?
        `,
      )
      .get(id) as PublicUserRow | undefined;

    return row ? mapPublicUserRow(row) : undefined;
  },

  create(input: { email: string; name: string; passwordHash: string }) {
    const id = uuidv4();

    db.prepare(
      `
        INSERT INTO users (id, email, name, password_hash)
        VALUES (?, ?, ?, ?)
      `,
    ).run(id, input.email, input.name, input.passwordHash);

    const user = this.findPublicById(id);

    if (!user) {
      throw new Error('Não foi possível carregar o usuário criado.');
    }

    return user;
  },
};
