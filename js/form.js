$(document).ready(function () {
  var  coordinates;
  $('#location_but').click(function(){
      
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            $("#latitude").val(position.coords.latitude);
           $("#longitude").val(position.coords.longitude);
        
       

          //getting reverse geocode using location IQ
          $.get( "https://us1.locationiq.com/v1/reverse.php?key=0ce4199f6376d7&lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&format=json", function(data) {
             $("#name").val(data.display_name);
          })
          var img = new Image();
          img.src="https://maps.locationiq.com/v2/staticmap?key=0ce4199f6376d7&center="+
          position.coords.latitude+","+position.coords.longitude+"&zoom=13&size=800x400&markers=icon:<icon>|"+
          position.coords.latitude+","+position.coords.longitude+"&markers=icon:<icon>|"+
          position.coords.latitude+","+position.coords.longitude+"";
          $('#output').html(img);
          
        });
        
    }
  });
  $("form.siteForm").on("submit", function (e) {
    e.preventDefault();
  
    var legal_name = $("#legal_name").val();
    var pan_vat = $("#pan_vat").val();
    var contact_person = $("#contact_person").val();
    var mobile_number = $("#mobile_number").val();
    var email = $("#email").val();
    var shop_category = $("#shop_category").val();
    var landmark_nearby = $("#landmark_nearby").val();
    var full_address = $("#name").val();
    let sitefiles = $("#image_name").get(0).files;
    let verificationfiles = $("#verification").get(0).files;
     var longitude =$("#longitude").val();
    var latitude=$("#latitude").val();

     
    var formData = new FormData(this);

    formData.append('legal_name', legal_name);
    formData.append('pan_vat', pan_vat);
    formData.append('contact_person', contact_person);
    formData.append('mobile_number', mobile_number);
    formData.append('email', email);
    formData.append('shop_category', shop_category);
    formData.append('landmark_nearby', landmark_nearby);
    formData.append('full_address', full_address);
    if (sitefiles.length > 0) {
      formData.append("image_name", sitefiles);
    }
    if (verificationfiles.length > 0) {
      formData.append("image_name", verificationfiles);
    }
   
    formData.append('longitude', longitude);
    formData.append('latitude', latitude);


    $.ajax({
      type: "POST",
      url: "http://localhost:3000/site/addSite",
      enctype: "multipart/form-data",
      data: formData,
      //Options to tell jQuery not to process data or worry about content-type.
      cache: false,
      contentType: false,
      processData: false,
      beforeSend: function (xhr) {

      },

      success: function (res, textStatus, jqXHR) {
        if (res.message_success == "Added Successfully") {
          alert("Successfully Added");
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log(xhr)
        alert(xhr)
      }
    });
    return false;
  });
});