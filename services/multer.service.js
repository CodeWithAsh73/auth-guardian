const multer = require("multer");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    const path = "./public/uploads/avatars";
    fs.mkdirSync(path, { recursive: true });
    cb(null, "./public/uploads/avatars");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      req.body.email.split("@")[0] +
        "-" +
        Date.now() +
        "." +
        file.mimetype.split("/")[1],
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
