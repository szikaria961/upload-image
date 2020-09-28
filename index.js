import express from 'express';
import multer from 'multer';
import morgan from 'morgan';
import helpers from './helpers';
import { existsSync, mkdirSync } from "fs";
import path from 'path';

const PORT = process.env.PORT || 8000;
const app = express();
const UPLOADS_PATH = __dirname + '/public/uploads';

app.use(express.json());
app.use(express.urlencoded({ extended: true} ));
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

if (!existsSync(UPLOADS_PATH)) {
  console.log(`[ server ] Creating documents path at ${UPLOADS_PATH}`);
  mkdirSync(UPLOADS_PATH);
}

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
);

const storage = multer.diskStorage({
    destination: './public/uploads',

    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('spotify-code');

app.post('/upload-spotify-code', (req, res) => {
    upload(req, res, (err) => {
        const path = req.file.path.replace("public/", "");

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        res.send(`You have uploaded this image: <hr/><img src="${path}" width="500"><hr />
          <a href="./">Upload another image</a>`);
        console.log(`${req.file.path} This is the path to my uploaded file.`);
    });
});

app.get('/uploads/:filename', (req, res) => {
  res.send()
});
app.listen(PORT, () => {
  console.log(`[index.js] is listening on ${PORT}`);
})