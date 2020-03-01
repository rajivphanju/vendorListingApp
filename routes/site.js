const express = require("express");
const router = express.Router();
const Site = require("../model/site");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

//Defining  and file name
var storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, "SITE" + "-" + Date.now() + file.originalname);
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
router.post(
  "/addSite",
  upload.fields([
    { name: "image_name", maxCount: 10 },
    { name: "verification", maxCount: 10 }
  ]),
  (req, res) => {
    if (req.files) {
      var image_name = req.files["image_name"].map(file => {
        let imagePath = file.path;
        let imagePath2 =
          "public/uploads/site/SITE" + "-" + Date.now() + file.originalname;

        //compressing image size
        sharp(imagePath)
          .jpeg({ quality: 25, progressive: true })
          .toFile(imagePath2);
        return imagePath2;
      });

      var verification_image = req.files["verification"].map(file => {
        let imagePath = file.path;
        let imagePath2 =
          "public/uploads/verification/SITE" +
          "-" +
          Date.now() +
          file.originalname;
        sharp(imagePath)
          .jpeg({ quality: 25, progressive: true })
          .toFile(imagePath2);
        return imagePath2;
      });
    }
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
        type: "Point",
        coordinates: [req.body.longitude, req.body.latitude]
      } //first field in coordinates array is longitude, not latitude
    });

    site
      .save()
      .then(async function(result) {
        try {
          if (image_name) {
            for (i = 0; i < image_name.length; i++) {
              result.image_names = result.image_names.concat({
                image_name: image_name[i]
              });
            }
          }
          if (verification_image) {
            for (a = 0; a < verification_image.length; a++) {
              result.verification_images = result.verification_images.concat({
                image_name: verification_image[a]
              });
            }
          }

          await result.save();
          res.status(201).json({
            message_success: "Added Successfully"
          });
        } catch (err) {
          res.status(500).send(console.log(err));
        }
      })
      .catch(err => {
        res.status(500).send(console.log(err));
      });
  }
);

//gets five recentyly added sites
router.get("/recentSite", function(req, res) {
  Site.find()
    .limit(5)
    .select("-__v")
    .sort({
      createdAt: "desc"
    })
    .then(function(siteList) {
      res.json(siteList);
    })
    .catch(function(e) {
      res.send(e);
    });
});

//gets all sites in descending order
router.get("/allSites", function(req, res) {
  Site.find()
    .select("-__v")
    .sort({
      createdAt: "desc"
    })
    .then(function(siteList) {
      res.json(siteList);
    })
    .catch(function(e) {
      res.send(e);
    });
});

//Shows detail of single site
router.get("/singleSite/:id", function(req, res) {
  var id = req.params.id.toString();
  Site.find({
    _id: id
  })
    .select("-__v")
    .then(function(siteList) {
      res.json(siteList);
    })
    .catch(function(e) {
      res.send(e);
    });
});

// router.post('/removeSiteImage/:id',  function (req, res) {
//   var id = req.params.id.toString(); //id of the site
//   var site_image_id=req.body.site_image_array;
//   var verification_image_id=req.body.verification_image_array;

//   Site.findByIdAndUpdate(
//     id, { $pull: { "image_names": { _id: site_image_id} , "verification_images": { _id: verification_image_id} } }, { safe: true, upsert: true },
//     function(err, result) {
//         if (err) { return handleError(res, err); }
//         res.status(200).json(result);
//     });

// });

// router.post('/removeVerificationImage/:id',  function (req, res) {
//   var id = req.params.id.toString(); //id of the site
//   var verification_image_id=req.body.verification_image_array; //id of individal image to be deleted
//   if(verification_image_id!=null){
//   Site.findByIdAndUpdate(
//     id, { $pull: { "verification_images": { _id: verification_image_id} } }, { safe: true, upsert: true },
//     function(err, result) {
//         if (err) { return handleError(res, err); }
//         return res.status(200).json(result);
//     });
//   }
// });

//update remarks and verification status
router.put(
  "/updateSite/:id",
  upload.fields([
    { name: "image_name", maxCount: 10 },
    { name: "verification", maxCount: 10 }
  ]),
  function(req, res) {
    siteId = req.params.id.toString();
    var site_image_id = req.body.site_image_array;
    var verification_image_id = req.body.verification_image_array;

    if (req.files) {
      var image_name = req.files["image_name"].map(file => {
        let imagePath = file.path;
        let imagePath2 =
          "public/uploads/site/SITE" + "-" + Date.now() + file.originalname;

        //compressing image size
        sharp(imagePath)
          .jpeg({ quality: 25, progressive: true })
          .toFile(imagePath2);
        return imagePath2;
      });

      var verification_image = req.files["verification"].map(file => {
        let imagePath = file.path;
        let imagePath2 =
          "public/uploads/verification/SITE" +
          "-" +
          Date.now() +
          file.originalname;
        sharp(imagePath)
          .jpeg({ quality: 25, progressive: true })
          .toFile(imagePath2);
        return imagePath2;
      });
    }

    Site.findOne({ _id: siteId }, function(err, image) {
      if (site_image_id) {
        for (i = 0; i < site_image_id.length; i++) {
          var img = image.image_names.id(site_image_id[i]);
          let path = img.image_name;
          fs.unlink(path, err => {
            if (err) console.log(err);
          });
        }
      }
      if (verification_image_id) {
        for (i = 0; i < verification_image_id.length; i++) {
          var img = image.verification_images.id(verification_image_id[i]);
          let path = img.image_name;
          fs.unlink(path, err => {
            if (err) console.log(err);
          });
        }
      }
    });

    Site.findByIdAndUpdate(
      siteId,
      {
        $pull: {
          image_names: { _id: site_image_id },
          verification_images: { _id: verification_image_id }
        }
      },
      { safe: true, upsert: true },
      function(err, result) {
        if (err) {
          return handleError(res, err);
        }
        if (result) {
          Site.findByIdAndUpdate(siteId, req.body, {
            new: true
          })
            .then(async function(site) {
              try {
                if (image_name) {
                  for (i = 0; i < image_name.length; i++) {
                    site.image_names = site.image_names.concat({
                      image_name: image_name[i]
                    });
                  }
                }
                if (verification_image) {
                  for (a = 0; a < verification_image.length; a++) {
                    site.verification_images = site.verification_images.concat({
                      image_name: verification_image[a]
                    });
                  }
                }
                await site.save();
                res.status(201).json({
                  message: "Site Updated Successfully"
                });
              } catch (err) {
                res.status(500).send(console.log(err));
              }
            })
            .catch(function(e) {
              res.send(e);
              console.log(e);
            });
        }
      }
    );
  }
);
module.exports = router;
