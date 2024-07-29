document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg, image/png';
    fileInput.style.display = 'none';
    let currentFile = null;

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFile(fileInput.files[0]);
        }
    });

    function handleFile(file) {
        currentFile = file;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                document.getElementById('originalImage').src = img.src;
                document.getElementById('preview').style.display = 'block';
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    document.getElementById('convertButton').addEventListener('click', () => {
        const compressionType = document.getElementById('compressionType').value;
        let quality = parseFloat(document.getElementById('quality').value);
        if (!currentFile) {
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
                        const convertedURL = URL.createObjectURL(blob);
                        document.getElementById('convertedImage').src = convertedURL;
                        const link = document.getElementById('downloadLink');
                        link.href = convertedURL;
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
        reader.readAsDataURL(currentFile);
    });
});