const express = require("express");

const Category = require("../models/categories") ;
const multer = require("multer");
const router = express.Router();
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images/categories");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const category = new Category({
      name: req.body.name,
      desc: req.body.desc,
      image: url + "/catimages/" + req.file.filename
    });
    category.save().then(createdCategory => {
      res.status(201).json({
        message: "Category added successfully",
        category:{...createdCategory , id:createdCategory._id }
      });
    });

  }
);

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/catimages/" + req.file.filename
    }
    const category = new Category({
      _id: req.body.id,
      name: req.body.name,
      desc: req.body.desc,
      image: imagePath
    });
    console.log(category);
    Category.updateOne({ _id: req.params.id }, category).then(result => {
      res.status(200).json({ message: "Update successful!" });
    });
  }
);




router.get("", (req, res, next) => {
  Category.find().then(documents => {
    res.status(200).json({
      // message: "Category fetched successfully!",
       categories: documents
    }
    );
  });
});


router.get("/:id", (req, res, next) => {
  Category.findById(req.params.id).then(category => {
  if (category) {
    res.status(200).json(category);
  } else {
    res.status(404).json({ message: "Category not found!" });
  }
});
});
router.delete("/:id", (req, res, next) => {
  Category.deleteOne({ _id: req.params.id }).then(result => {
  console.log(result);
  res.status(200).json({ message: "Category deleted!" });
});
});

module.exports = router;
