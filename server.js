var express	=	require("express");
var multer	=	require('multer');
var app	=	express();
var sharp = require("sharp");
var path = require("path");

var fileName = "";
var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
    
  },
  filename: function (req, file, callback) {
    fileName = file.fieldname + '-' + Date.now() + '.jpg';
    callback(null, fileName);
  }
});
var upload = multer({ storage : storage}).single('userPhoto');

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.post('/api/photo',function(req,res){
	upload(req,res,function(err) {
		if(err) {
			return res.end("Error uploading file.");
		}
		
    var file = path.join(__dirname, '\\uploads\\' + fileName);
    sharp(file)
        .resize(200, 300, {
          kernel: sharp.kernel.lanczos2,
          interpolator: sharp.interpolator.nohalo
        })
        .background('white')
        .embed()
        .toFile('./output/' + fileName)
        .then(function() {
          // output.tiff is a 200 pixels wide and 300 pixels high image
          // containing a lanczos2/nohalo scaled version, embedded on a white canvas,
          // of the image data in inputBuffer
        });
      res.end("File is uploaded");
	});
  
});

app.listen(3000,function(){
    console.log("Working on port 3000");
});
