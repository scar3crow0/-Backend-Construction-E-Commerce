const multer = require("multer");

console.log("test1");
// Set up Multer storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      "D:/Freelancing/abdullah fyp/Construction site mk 1/construction_site_frontend/public/images/uploads"
    ); // Destination directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    // Use a unique filename to prevent overwriting existing files
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Use the original filename with a unique prefix
  },
});

// Create a Multer instance with the specified storage options
const upload = multer({ storage: storage });

module.exports = upload;
