// server/src/middlewares/roles.js
function requireRole(role) {
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ msg: 'Not authenticated' });
    if (Array.isArray(role)) {
      if (!role.includes(req.user.role)) return res.status(403).json({ msg: 'Forbidden' });
    } else {
      if (req.user.role !== role) return res.status(403).json({ msg: 'Forbidden' });
    }
    next();
  };
}

module.exports = { requireRole };
