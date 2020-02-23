const express = require("express");
const router = express.Router();
const Site = require("../model/site");
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');


//Defining  and file name
var storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, "SITE" + '-' + Date.now() + file.originalname);
  }
});

//validations
var imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|PNG|gif)$/)) {
    return cb(new Error("File format not supported! "), false);
  }
  cb(null, true);
};

var upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10 //10MB
  }
});

//inserts image from two input fields "image_name" and "verification"
//'image_name = id from front end && 10 = maximum files allowed
router.post("/addSite", upload.fields([{name: 'image_name',maxCount: 10}, {
  name: "verification",  maxCount: 10}]), (req, res) => {

  const site = new Site({
    legal_name: req.body.legal_name,
    pan_vat: req.body.pan_vat,
    contact_person: req.body.contact_person,
    mobile_number: req.body.mobile_number,
    email: req.body.email,
    shop_category: req.body.shop_category,
    landmark_nearby: req.body.landmark_nearby,
    full_address: req.body.full_address,
    store_location: {
      'type': "Point",
      'coordinates': [req.body.longitude, req.body.latitude]
    }, //first field in coordinates array is longitude, not latitude
    image_names: req.files['image_name'].map(file => {
      let imagePath = file.path;
      let imagePath2 = 'public/uploads/site/SITE' + '-' + Date.now() + file.originalname;
      sharp(imagePath)
        .jpeg({ quality: 1, progressive: true })
        .toFile(imagePath2);
      return imagePath2;
    }),
    verification_image: req.files['verification'].map(file => {
      let imagePath = file.path;
      let imagePath2 = 'public/uploads/verification/SITE' + '-' + Date.now() + file.originalname;
      console.log(imagePath2)
      sharp(imagePath)
        .jpeg({ quality: 1, progressive: true })
        .toFile(imagePath2);
      return imagePath2;
    })

  });

  site
    .save()
    .then(result => {
      res.status(201).json({
        message_success: "Added Successfully"
      });
    })
    .catch(err => {
      res.status(500).send(
        err
      );
    });
});

router.get('/siteList', function (req, res) {
  Site.find().then(function (siteList) {
     res.json(
         siteList
     );
 });
});

router.put('/verifySites/:id', function (req, res) {
  siteId = req.params.id.toString();

  Site.findByIdAndUpdate(siteId, req.body, {
      new: true
  }).then(function (site) {
      res.send(site);
  }).catch(function (e) {
      res.send(e);
  });
});
module.exports = router;