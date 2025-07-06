const { getAuth } = require("firebase-admin/auth");


exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    
    const decodedToken = await getAuth().verifyIdToken(token);

   
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ message: "Invalid token", error: error.message });
  }
};
