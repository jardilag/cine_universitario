const mysql = require('mysql2')
const { readFileSync } = require('node:fs')

const enRender = process.env.RENDER === 'true'
const prefijo = enRender ? 'TIDB' : 'DB'

function leer(campo, permiteVacio = false) {
  const nombre = `${prefijo}_${campo}`
  const valor = process.env[nombre]
  if (valor === undefined || (!permiteVacio && !valor.trim())) {
    throw new Error(`Falta configurar ${nombre}`)
  }
  return valor
}

const port = Number(leer('PORT'))
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`${prefijo}_PORT debe ser un puerto válido`)
}

const rutaCA = process.env.TIDB_CA_PATH

module.exports = mysql.createPool({
  host: leer('HOST'),
  port,
  user: leer('USER'),
  password: leer('PASSWORD', !enRender),
  database: leer('DATABASE'),
  connectionLimit: 5,
  ssl: enRender ? {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true,
    verifyIdentity: true,
    ca: rutaCA ? readFileSync(rutaCA) : undefined
  } : undefined
})