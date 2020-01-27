const express = require("express");

const SubCategory = require("../models/subcategories") ;
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
    cb(error, "backend/images/subcategories");
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
    const subCategory = new SubCategory({
      name: req.body.name,
      desc: req.body.desc,
      catid: req.body.catid,
      image: url + "/subcatimages/" + req.file.filename
    });
    subCategory.save().then(createdSubCategory => {
      res.status(201).json({
        message: "Sub Category added successfully",
        subCategory:{...createdSubCategory ,
        id:createdSubCategory._id }

      });
    });

  }
);

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.image;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/subcatimages/" + req.file.filename;
    }
    const subCategory = new SubCategory({
      _id: req.body.id,
      name: req.body.name,
      desc: req.body.desc,
      catid: req.body.catid,
      image: imagePath
    });
    console.log(subCategory);
    SubCategory.updateOne({ _id: req.params.id }, subCategory).then(result => {
      res.status(200).json({ message: "Update successful!" });
    });
  }
);





router.get("", (req, res, next) => {
  SubCategory.find().then(documents => {
    res.status(200).json({
      message: "Sub Category fetched successfully!",
      subcategories: documents
    });
  });
});


router.get("/:id", (req, res, next) => {
  SubCategory.findById(req.params.id).then(subCategory => {
  if (subCategory) {
    res.status(200).json(subCategory);
  } else {
    res.status(404).json({ message: "sub Category not found!" });
  }
});
});
router.delete("/:id", (req, res, next) => {
  SubCategory.deleteOne({ _id: req.params.id }).then(result => {
  console.log(result);
  res.status(200).json({ message: "Sub Category deleted!" });
});
});

module.exports = router;
