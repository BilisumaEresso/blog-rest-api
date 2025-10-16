const isSuperAdmin = (req, res, next) => {
  try {
    if (req.user && (req.user.role === 1)) {
      next();
    } else {
      res.code = 401;
      throw new Error("permission denied");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = isSuperAdmin;
