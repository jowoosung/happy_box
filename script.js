const fileInput = document.getElementById('fileInput');
const dragArea = document.getElementById('dragArea');
const resizeButton = document.getElementById('resizeButton');
const downloadButton = document.getElementById('downloadButton');
const clearButton = document.getElementById('clearButton');

let resizedImages = [];
let totalFiles = []; // 전체 파일을 저장할 배열

function clearAll() {
  dragArea.innerHTML = '이미지를 드래그 하세요';
  resizedImages.length = 0;
  downloadButton.disabled = true;
  fileInput.value = '';
  totalFiles = []; // 배열 초기화
}

function handleFiles(newFiles) {
  totalFiles = [...totalFiles, ...Array.from(newFiles)];
  dragArea.innerHTML = '';

  totalFiles.forEach((file, index) => {
    const img = new Image();
    const imgPreview = new Image();

    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = 1280;
      canvas.height = 960;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        resizedImages[index] = url;
      }, 'image/png'); // PNG format
    };

    imgPreview.onload = function() {
      imgPreview.width = dragArea.clientWidth / totalFiles.length;
      dragArea.appendChild(imgPreview);
    };

    const reader = new FileReader();
    reader.onload = function(e) {
      img.src = e.target.result;
      imgPreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  downloadButton.disabled = false;
}

resizeButton.addEventListener('click', function() {
  const files = fileInput.files;
  handleFiles(files);
});

downloadButton.addEventListener('click', function() {
  resizedImages.forEach(function(url, index) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `resized-image-${index + 1}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  alert("리사이징 완료"); // 리사이징 완료 팝업 알림
});

clearButton.addEventListener('click', function() {
  clearAll();
});

dragArea.addEventListener('dragover', function(e) {
  e.preventDefault();
  dragArea.classList.add('active');
});

dragArea.addEventListener('dragleave', function(e) {
  e.preventDefault();
  dragArea.classList.remove('active');
});

dragArea.addEventListener('drop', function(e) {
  e.preventDefault();
  dragArea.classList.remove('active');
  const files = e.dataTransfer.files;
  handleFiles(files);
});

fileInput.addEventListener('change', function() {
  const files = fileInput.files;
  handleFiles(files);
});
