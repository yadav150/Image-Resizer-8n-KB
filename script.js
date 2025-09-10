document.addEventListener("DOMContentLoaded", () => {
  const imageFile = document.getElementById("imageFile");
  const sizeKB = document.getElementById("sizeKB");
  const resizeBtn = document.getElementById("resizeBtn");
  const result = document.getElementById("result");

  resizeBtn.addEventListener("click", () => {
    const file = imageFile.files[0];
    const targetSize = parseInt(sizeKB.value);

    if (!file) {
      alert("Please upload an image.");
      return;
    }
    if (!targetSize || targetSize <= 0) {
      alert("Please enter a valid target size in KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.src = e.target.result;

      img.onload = function() {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        let quality = 0.9;

        function compressAndCheck() {
          const dataURL = canvas.toDataURL("image/jpeg", quality);
          const size = Math.round((dataURL.length * (3/4)) / 1024);

          if (size > targetSize && quality > 0.05) {
            quality -= 0.05;
            compressAndCheck();
          } else if (size > targetSize && quality <= 0.05) {
            // Reduce dimensions if quality too low
            canvas.width *= 0.9;
            canvas.height *= 0.9;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            quality = 0.9;
            compressAndCheck();
          } else {
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = `resized_${file.name}`;
            link.textContent = `Download Resized Image (${size} KB)`;
            link.className = "download-link";
            result.innerHTML = "";
            result.appendChild(link);
          }
        }

        compressAndCheck();
      };
    };

    reader.readAsDataURL(file);
  });
});
