document.getElementById('convertButton').addEventListener('click', () => {
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];
    const compressionType = document.getElementById('compressionType').value;
    let quality = parseFloat(document.getElementById('quality').value);

    if (!file) {
        alert('Please select an image file.');
        return;
    }

    if (compressionType === 'lossless') {
        quality = 1.0;  // Lossless compression ignores quality parameter
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                if (blob) {
                    const link = document.getElementById('downloadLink');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'converted.webp';
                    link.style.display = 'block';
                    link.textContent = 'Download WEBP';
                } else {
                    alert('Conversion to WEBP failed.');
                }
            }, 'image/webp', quality);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});