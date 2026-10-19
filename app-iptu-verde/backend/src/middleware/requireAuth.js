import { verifyAccessToken } from '../services/authService.js';

export function requireAuth(request, response, next) {
  const authorization = request.get('authorization') ?? '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ erro: 'Autenticação necessária.' });
  }

  try {
    const claims = verifyAccessToken(token);
    if (typeof claims.sub !== 'string' || !claims.sub) {
      return response.status(401).json({ erro: 'Sessão inválida.' });
    }
    request.usuario = { id: claims.sub, tipo: claims.tipo };
    return next();
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError' ||
      error.name === 'NotBeforeError'
    ) {
      return response
        .status(401)
        .json({ erro: 'Sessão inválida ou expirada.' });
    }
    return next(error);
  }
}
