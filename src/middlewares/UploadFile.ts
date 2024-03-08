import * as multer from "multer";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "src/upload/image"); // Menyimpan file di direktori './public/image'
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`); // Menetapkan nama file
	},
});

const UploadImage = multer({ storage: storage });

export default UploadImage;



































// import * as multer from "multer"
// import { diskStorage } from "multer"
// import { NextFunction, Request, Response } from "express"


// export default new class UploadImgMiddleware {
//     Upload(fieldName: string) {
//         const storage = multer.diskStorage({
//             destination: (req, file, cb) => {
//                 cb(null, 'src/uploads')
//             },
//             filename: (req, file, cb) => {
//                 cb(null, file.fieldname + '-' + Date.now() + ".png")
//             }
//         })

//         const uploadFile = multer({
//             storage: storage
//         })

//         return(req: Request, res: Response, next: NextFunction) => {
//             uploadFile.single(fieldName)(req, res, function (err:any) => {
//                 if (err) {
//                     return res.status(400).json({ code: 400, message: err.message })
//                 }
                
//             })
//         }
//     }
// }