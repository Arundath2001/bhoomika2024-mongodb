import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirs = {
    city: "uploads/cities/",
    property: "uploads/properties/",
    selling: "uploads/selling/"
};

Object.values(uploadDirs).forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (req.uploadType === "city") {
            cb(null, uploadDirs.city);
        } else if (req.uploadType === "selling") {
            cb(null, uploadDirs.selling);
        } else {
            cb(null, uploadDirs.property);
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    } else {
        return cb(new Error("Only images (jpeg, jpg, png) are allowed"));
    }
};

export const uploadCityImage = (req, res, next) => {
    req.uploadType = "city";
    multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })
        .single("cityImage")(req, res, next);
};

export const uploadPropertyImages = (req, res, next) => {
    req.uploadType = "property";
    multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })
        .array("files", 6)(req, res, next);
};

export const uploadSellingImages = (req, res, next) => {
    req.uploadType = "selling";
    multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })
        .array("files", 6)(req, res, next);
};
