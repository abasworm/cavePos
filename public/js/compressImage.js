const fileReader = new FileReader();
const filterType = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

fileReader.onload = function (event) {
  const image = new Image();
  
  image.onload=function(){
      console.log((600*100/image.width)/100 * image.height)
      document.getElementById("original-Img").src=image.src;
      const canvas=document.createElement("canvas");
      const context=canvas.getContext("2d");
      canvas.width=600;
      canvas.height=(600*100/image.width)/100 * image.height;
      context.drawImage(image,
          0,
          0,
          image.width,
          image.height,
          0,
          0,
          canvas.width,
          canvas.height
      );
    
      const imageData=context.getImageData(0,0, 600, (600*100/image.width)/100 * image.height);
      
  // This loop gets every pixels on the image and
      for (i=0; i<imageData.height; i++)
      {
        for (j=0; j<imageData.width; j++)
        {
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
      
      document.getElementById("upload-Preview").src = canvas.toDataURL('image/webp',1.0);
  }
  image.src=event.target.result;
};

const loadImageFile = function () {
  var uploadImage = document.getElementById("upload-Image");
  
  //check and retuns the length of uploded file.
  if (uploadImage.files.length === 0) { 
    return; 
  }
  
  //Is Used for validate a valid file.
  var uploadFile = document.getElementById("upload-Image").files[0];
  if (!filterType.test(uploadFile.type)) {
    alert("Please select a valid image."); 
    return;
  }
  
  fileReader.readAsDataURL(uploadFile);
}