---
name: db0
description: Lightweight SQL connector
---

# Db0

Db0 is a lightweight SQL connector that provides a simple and type-safe way to interact with SQL databases.

## Usage

### Basic Connection

```typescript
import { createConnection } from 'db0'

const db = createConnection({
  driver: 'sqlite',
  database: './db.sqlite',
})
```

### Query Execution

```typescript
const users = await db.query('SELECT * FROM users WHERE id = ?', [1])
```

### Type-Safe Queries

```typescript
interface User {
  id: number
  name: string
  email: string
}

const users = await db.query<User[]>('SELECT * FROM users')
```

### Transactions

```typescript
await db.transaction(async (tx) => {
  await tx.query('INSERT INTO users (name) VALUES (?)', ['John'])
  await tx.query('INSERT INTO users (name) VALUES (?)', ['Jane'])
})
```

## Key Points

- Lightweight: Minimal overhead
- Type-safe: Full TypeScript support
- Multiple drivers: Supports SQLite, PostgreSQL, MySQL, etc.
- Transactions: Built-in transaction support
- Simple API: Easy to use

<!--
Source references:
- https://github.com/unjs/db0
- https://db0.unjs.io
-->
