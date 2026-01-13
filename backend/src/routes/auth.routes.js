const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  deleteProfile 
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.delete("/profile", auth, deleteProfile);

module.exports = router;
