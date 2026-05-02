const jwt = require("jsonwebtoken");

const authCheck = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, "secretKey");
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("AuthCheck Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const adminAuth = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, "secretKey");
    if (decodedToken.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can access this route" });
    }
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("AdminAuth Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { authCheck, adminAuth };
