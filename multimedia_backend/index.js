const express = require('express')
const cors = require('cors')
const { identificar, exigirAdmin } = require('./middleware/autorizacion')
const conexion = require('./database/conexion')
const authRoutes = require('./routes/authRoutes')
const directorRoutes = require('./routes/directorRoutes')
const generoRoutes = require('./routes/generoRoutes')
const mediaRoutes = require('./routes/mediaRoutes')
const productoraRoutes = require('./routes/productoraRoutes')
const tipoRoutes = require('./routes/tipoRoutes')

const app = express()
const enRender = process.env.RENDER === 'true'
const puerto = Number(process.env.PORT ?? 3000)
const host = enRender ? '0.0.0.0' : '127.0.0.1'

if (enRender) app.set('trust proxy', 1)

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth', authRoutes)

app.use('/api', identificar, (req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD') return next()
  return exigirAdmin(req, res, next)
})

app.use('/api/directores', directorRoutes)
app.use('/api/generos', generoRoutes)
app.use('/api/media', mediaRoutes)
app.use('/api/productoras', productoraRoutes)
app.use('/api/tipos', tipoRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de cine' })
})

conexion.query('SELECT 1', (error) => {
  if (error) {
    console.error('Error al conectar con la base de datos', error.code)
    return conexion.end(() => { process.exitCode = 1 })
  }

  app.listen(puerto, host, () => {
    console.log(`API en puerto ${puerto} con ${enRender ? 'TiDB Cloud' : 'MariaDB local'}`)
  })
})
