import { extname } from 'path';

const imgTypeFile = ['.svg', '.jpg', '.png', '.jpeg'];

const imgValidator = (req, file, cb) => {
  if (imgTypeFile.find((item) => item === extname(file.originalname))) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export default imgValidator;
