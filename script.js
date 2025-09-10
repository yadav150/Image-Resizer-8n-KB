document.addEventListener("DOMContentLoaded", () => {
  const imageFile = document.getElementById("imageFile");
  const sizeKB = document.getElementById("sizeKB");
  const resizeBtn = document.getElementById("resizeBtn");
  const result = document.getElementById("result");
  const preview = document.getElementById("preview");

  let resized = false;

  resizeBtn.addEventListener("click", () => {
    if(resized){
      // Reset form
      imageFile.value = "";
      sizeKB.value = "";
      result.innerHTML = "Upload an image and enter target size.";
      preview.src = "";
      resizeBtn.textContent = "Resize Image";
      resized = false;
      return;
    }

    const file = imageFile.files[0];
    const targetKB = parseInt(sizeKB.value);

    if(!file) return alert("Please upload an image.");
    if(!targetKB || targetKB <= 0) return alert("Enter valid target size.");

    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img,0,0);

        let quality = 0.9;

        function compress() {
          const dataURL = canvas.toDataURL("image/jpeg", quality);
          const size = Math.round((dataURL.length*3/4)/1024);
          if(size > targetKB && quality > 0.05){
            quality -= 0.05;
            compress();
          } else if(size > targetKB && quality <= 0.05){
            canvas.width *= 0.9;
            canvas.height *= 0.9;
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(img,0,0,canvas.width,canvas.height);
            quality = 0.9;
            compress();
          } else {
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "resized_" + file.name;
            link.textContent = `Download (${size} KB)`;
            link.className = "download-link";
            result.innerHTML = "";
            result.appendChild(link);
            preview.src = dataURL;

            // Change button to Reset
            resizeBtn.textContent = "Reset";
            resized = true;
          }
        }
        compress();
      }
    };
    reader.readAsDataURL(file);
  });
});
