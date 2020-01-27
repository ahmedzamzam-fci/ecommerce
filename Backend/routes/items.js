const express = require("express");

const Item = require("../models/items") ;
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
    cb(error, "backend/images/items");
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

router.post("",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const item = new Item({
      name: req.body.name,
      desc: req.body.desc,
      price: req.body.price,
      image: url + "/itemimages/" + req.file.filename,
      subcatid: req.body.subcatid,

    });

    console.log('items ',item);
    item.save().then(createdItem => {
      res.status(201).json({
        message: "Category added successfully",
        item:{...createdItem ,id:createdItem._id }
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
      imagePath = url + "/itemimages/" + req.file.filename
    }
    console.log('image to be updated   '+ imagePath);
    const item = new Item({
      _id: req.body.id,
      name: req.body.name,
      desc: req.body.desc,
      subcatid: req.body.subcatid,
      price: req.body.price,
      image: imagePath
    });
    console.log(item);
    Item.updateOne({ _id: req.params.id }, item).then(result => {
      res.status(200).json({ message: "Update successful!" });
    });
  }
);





router.get("", (req, res, next) => {
  Item.find().then(documents => {
    res.status(200).json({
      message: "Category fetched successfully!",
      items: documents
    });
  });
});


router.get("/:id", (req, res, next) => {
  Item.findById(req.params.id).then(item => {
  if (item) {
    res.status(200).json(item);
  } else {
    res.status(404).json({ message: "Item not found!" });
  }
});
});
router.delete("/:id", (req, res, next) => {
  Item.deleteOne({ _id: req.params.id }).then(result => {
  console.log(result);
  res.status(200).json({ message: "Category deleted!" });
});
});

module.exports = router;
