
const imagePreview = "upload_files_display";
const imageName = "fupload_files";
const grayscale= true;
const maxWidth = 600;
let fileReader = new FileReader();

fileReader.onload = function (event) {
    var image = new Image();
    image.onload = function(){
        //document.getElementById(imageSource).src = image.src;
        
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = maxWidth;
        canvas.height= (maxWidth * 100 / image.width) / 100 * image.height ;
        
        //shrink
        context.drawImage(image,0,0,image.width,image.height,0,0,canvas.width,canvas.height);

        //grayscale image
        if(grayscale){
            const imageData = context.getImageData(0,0, maxWidth, canvas.height);
            for (i=0; i<imageData.height; i++){
                for (j=0; j<imageData.width; j++){
                    let index=(i*4)*imageData.width+(j*4);
                    let red=imageData.data[index];
                    let green=imageData.data[index+1];
                    let blue=imageData.data[index+2];
                    let alpha=imageData.data[index+3];
                    let average=(red+green+blue)/3;
                    imageData.data[index]=average;
                    imageData.data[index+1]=average;
                    imageData.data[index+2]=average;
                    imageData.data[index+3]=alpha;
                }
            }
            context.putImageData(imageData,0,0,0,0, imageData.width,   imageData.height);
        }

        document.getElementById(imagePreview).src = canvas.toDataURL('image/jpeg',1.0);
    }
  image.src = event.target.result;
}

function loadImageFile (id) {
    const uploadImage = document.getElementById(imageName);
    const filterType = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

    //check and retuns the length of uploded file.
    if (uploadImage.files.length === 0) { 
      return; 
    }
    
   var uploadFile = document.getElementById(imageName).files[0];
    
    if (!filterType.test(uploadFile.type)) {
      alert("Please select a valid image."); 
      return;
    }
    console.log(uploadFile)
    fileReader.readAsDataURL(uploadFile);
}

function base64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}