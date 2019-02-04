var Response = require('../utils/Response');
var Config = require('../config/general');
var mongoose = require('mongoose');
var multer = require('multer');
var XLSX = require('xlsx');

var uploadedFileName;
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        uploadedFileName = file.fieldname + '_' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        cb(null, file.fieldname + '_' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});
var upload = multer({ //multer settings
    storage: storage
}).single('file');

const UploadController = {
    uploadFile: function(req, res) {
        upload(req, res, function(err) {
            if (err) {
                res.json({ error_code: 1, err_desc: err });
                return;
            }

            // Get the file and convert to JSON
            var workbook = XLSX.readFile('./uploads/'+uploadedFileName);
            var sheet_name_list = workbook.SheetNames;
            var FileInJSON = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {defval:''});
            //console.log('FileInJSON', FileInJSON);

            //
            
            res.json(FileInJSON);
        })
    }
};

module.exports = UploadController;