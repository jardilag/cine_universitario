const jwt = require('jsonwebtoken')

const secreto = process.env.ADMIN_JWT_SECRET ?? ''
const emisor = 'cine-universitario'
const expiraEnSegundos = 30 * 60

if (!/^[a-f0-9]{64}$/i.test(secreto)) {
  throw new Error('ADMIN_JWT_SECRET debe contener 64 caracteres hexadecimales')
}

const clave = Buffer.from(secreto, 'hex')

function crearSesion({ id_usuario, rol }) {
  const token = jwt.sign({ rol }, clave, {
    algorithm: 'HS256',
    issuer: emisor,
    subject: String(id_usuario),
    expiresIn: expiraEnSegundos
  })

  return { token, expiraEnSegundos }
}

function identificar(req, res, next) {
  res.set('Cache-Control', 'no-store')
  req.usuario = null
  const encabezado = req.get('Authorization')
  if (!encabezado) return next()

  const coincidencia = /^Bearer (\S+)$/i.exec(encabezado)
  if (!coincidencia) {
    return res.status(401).json({ message: 'Token inválido' })
  }

  try {
    const sesion = jwt.verify(coincidencia[1], clave, {
      algorithms: ['HS256'],
      issuer: emisor
    })
    if (typeof sesion?.sub !== 'string' || !/^[1-9]\d*$/.test(sesion.sub) ||
        !['ADMIN', 'USUARIO'].includes(sesion.rol)) {
      return res.status(401).json({ message: 'Vuelve a iniciar sesión' })
    }
    req.usuario = sesion
  } catch {
    return res.status(401).json({ message: 'Token inválido o vencido' })
  }

  return next()
}

function exigirAdmin(req, res, next) {
  if (!req.usuario) {
    return res.status(401).json({ message: 'Inicia sesión como administrador' })
  }
  if (req.usuario.rol !== 'ADMIN') {
    return res.status(403).json({ message: 'Se requieren permisos de administrador' })
  }
  return next()
}

module.exports = { crearSesion, identificar, exigirAdmin }
