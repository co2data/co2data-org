import { cast, Field } from '@planetscale/database'

function parseObjectRow(fields: any[], rawRow: any) {
  const row = decodeRow(rawRow)
  return fields.reduce(
    (acc: { [x: string]: any }, field: Field, ix: string | number) => {
      // @ts-ignore
      acc[field.name] = cast(field, row[ix])
      return acc
    },
    {}
  )
}
export function parse(result: { fields: any; rows: any }) {
  const fields = result.fields
  const rows = result.rows ?? []
  return rows.map((row: any) => parseObjectRow(fields, row))
}
function decodeRow(row: { values: string; lengths: any[] }) {
  const values = row.values ? atob(row.values) : ''
  let offset = 0
  return row.lengths.map((size: string) => {
    const width = parseInt(size, 10)
    if (width < 0) return null
    const splice = values.substring(offset, offset + width)
    offset += width
    return splice
  })
}

export function encode(data: any[]) {
  const fields = Object.keys(data[0]).map((field) => ({
    charset: 255,
    columnLength: 1020,
    database: 'co2data-org',
    flags: 4097,
    name: field,
    orgName: field,
    orgTable: 'co2_average',
    table: 'co2_average',
    type: stringify(data[0][field]),
  }))
  const rows = data.map(
    (obj: { [s: string]: unknown } | ArrayLike<unknown>) => {
      const lengths = Object.values(obj).map((attribute) =>
        String(String(attribute).length)
      )
      const values = Object.values(obj)
        .map((attribute) => String(attribute))
        .join('')

      const base64Values = btoa(values)
      return {
        lengths,
        values: base64Values,
      }
    }
  )
  return { fields, rows }
}

function stringify(value: any) {
  if (typeof value === 'string') {
    return 'VARCHAR'
  }
  if (!isNaN(parseFloat(value))) {
    return 'FLOAT64'
  }
  return 'VARCHAR'

  // Original cast swich of parser
  //
  // switch (field.type) {
  //   case 'INT8':
  //   case 'INT16':
  //   case 'INT24':
  //   case 'INT32':
  //   case 'UINT8':
  //   case 'UINT16':
  //   case 'UINT24':
  //   case 'UINT32':
  //   case 'YEAR':
  //     return parseInt(value, 10)
  //   case 'FLOAT32':
  //   case 'FLOAT64':
  //     return parseFloat(value)
  //   case 'DECIMAL':
  //   case 'INT64':
  //   case 'UINT64':
  //   case 'DATE':
  //   case 'TIME':
  //   case 'DATETIME':
  //   case 'TIMESTAMP':
  //   case 'BLOB':
  //   case 'BIT':
  //   case 'VARBINARY':
  //   case 'BINARY':
  //     return value
  //   case 'JSON':
  //     return JSON.parse(decode(value))
  //   default:
  //     return decode(value)
}
