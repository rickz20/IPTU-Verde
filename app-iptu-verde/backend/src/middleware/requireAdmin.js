export function requireAdmin(request, response, next) {
  if (request.usuario?.tipo !== 'adm') {
    return response.status(403).json({
      erro: 'Acesso permitido somente para administradores.',
    });
  }

  return next();
}
