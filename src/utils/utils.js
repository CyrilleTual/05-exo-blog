
export function mySession(req)  {
    const session = {
      user: req.session.username || null,
      islog: req.session.isLogged || null,
      role: req.session.role || null,
      idUser: req.session.idUser || null,
    };
    return session;
};
