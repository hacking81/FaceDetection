const input = document.querySelector('.input');
const inputFile = input.querySelector('.inputFile');
const img = document.querySelector('.img');
// Image
const image = new Image();
// Canvas and Context
const canvas = document.querySelector('.canvas');
const faceCanvas = document.querySelector('.faceCanvas');
const ctx = canvas.getContext('2d');
const faceCtx = faceCanvas.getContext('2d');
// Global Variables
const faceDetector = new window.FaceDetector();
let finalWidth;
let finalHeight;
const SIZE = 10;

// Detecting faces and Censor
const faceDetectAndCensor = async () => {
  const faces = await faceDetector.detect(img);
  faces.forEach(({ boundingBox: face }) => {
    const { x, y, width, height } = face;
    faceCtx.imageSmoothingEnabled = false;
    faceCtx.drawImage(
      img,
      x,
      y,
      width,
      height,
      // Draw
      x,
      y,
      SIZE,
      SIZE
    );

    faceCtx.drawImage(
      faceCanvas,
      x,
      y,
      SIZE,
      SIZE,
      // draw
      x,
      y,
      width,
      height
    );
  });
};

// Drawing input image to canvas to change Width and Height
const drawImageCanvas = () => {
  const { width: imgWidth, height: imgHeight } = image;
  const ratio = imgWidth / imgHeight;
  const width = window.innerHeight * ratio - 10;
  const height = window.innerWidth / ratio - 10;
  if (width > window.innerWidth) {
    finalHeight = height;
    finalWidth = finalHeight * ratio;
  } else if (height > window.innerHeight) {
    finalWidth = width;
    finalHeight = finalWidth / ratio;
  } else {
    finalWidth = width;
    finalHeight = height;
  }
  // Changing Canvas Width and Height according to IMage size;
  canvas.width = finalWidth;
  canvas.height = finalHeight;
  faceCanvas.width = finalWidth;
  faceCanvas.height = finalHeight;

  ctx.drawImage(
    image,
    0,
    0,
    imgWidth,
    imgHeight,
    // draw
    0,
    0,
    finalWidth,
    finalHeight
  );

  img.src = canvas.toDataURL('image/jpg');
  img.width = finalWidth;
  img.height = finalHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Adding close class to input
  input.classList.add('close');
};

// Handling input file
const handleInputFile = ({ currentTarget: { files } }) => {
  image.onload = drawImageCanvas;
  const fileReader = new FileReader();
  fileReader.onload = ({ target: { result } }) => {
    image.src = result;
  };
  fileReader.readAsDataURL(files[0]);
};

// EventListeners
inputFile.addEventListener('change', handleInputFile);
img.addEventListener('load', faceDetectAndCensor);

// Input Toggler
const inputToggler = document.querySelector('.inputToggler');

inputToggler.addEventListener('click', () => {
  input.classList.toggle('close');
  if (!input.classList.contains('close')) {
    inputToggler.textContent = '❌';
  } else {
    inputToggler.textContent = '🎨';
  }
});
