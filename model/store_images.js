const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const siteImageSchema = new Schema({

    image_names: [
        {
          image_name: {
            type: String,
           required: true
          }
        }
      ],
      site_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
      }
}, {
    timestamps: true
});


const Site_images = mongoose.model("site_images", siteImageSchema);
module.exports = Site_images;