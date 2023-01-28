import mysql, { RowDataPacket } from 'mysql2/promise'

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'mydb',
})

const mkSelect =
  (deps: { conn: mysql.Pool }) =>
  async <T>(query: string, args?: any[]) => {
    const [rows] = await deps.conn.execute<Array<T & RowDataPacket>>(
      query,
      args
    )
    return rows
  }

export const select = mkSelect({ conn: pool })
