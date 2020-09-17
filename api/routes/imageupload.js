const expressRouter = require('express').Router();
const multer = require('multer');

let uploader = multer({
    dest: "static/userImages/"
});

const ImageUpload = expressRouter.post('/', uploader.single('image'), (req, res) => {
    if(req.file) {
        res.json({
            "success": 1,
            "file": {
                "url" : '/userImages/' + req.file.filename
            }
        });
        res.end();
    }
    else {
        res.json({
            "success": 0
        });
        res.end();
    }
});

module.exports = ImageUpload;