import { PutObjectCommand, PutObjectCommandOutput, S3Client, } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import multer from "multer";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { eS3AssetsFolder } from "src/types/common.interface";
import utils from "src/utils";
export interface IS3UploadOutput extends PutObjectCommandOutput {
  ObjectURL: string
}


let limits = {
    // files: 1, // allow only 1 file per request
    fileSize: 5 * 1024 * 1024, // (replace MBs allowed with your desires)
};

export class S3Service  {
    private AWS_ACCESS_KEY: string = process.env["AWS_ACCESS_KEY_ID"] || "";
    private AWS_SECRET_ACCESS_KEY = process.env["AWS_SECRET_ACCESS_KEY"] || ""
    private AWS_S3_BUCKET_NAME = process.env["AWS_S3_BUCKET_NAME"] || ""
    private AWS_S3_REGION = process.env["AWS_S3_REGION"] || "";
    private client: S3Client;
    
    constructor() {
        this.client = new S3Client({
          credentials: {
            accessKeyId: this.AWS_ACCESS_KEY,
            secretAccessKey: this.AWS_SECRET_ACCESS_KEY
          }, region: this.AWS_S3_REGION
        });
        
    }

  public s3URL =`https://${this.AWS_S3_BUCKET_NAME}.s3.${this.AWS_S3_REGION}.amazonaws.com`;

  upload = (folderName: eS3AssetsFolder) => multer({
    limits,
    storage: multerS3({
      s3: this.client,
      bucket: this.AWS_S3_BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname, ...req.body });
      },
      key: function (req, file, cb) {
        const extension = file.originalname.split(".").pop();
        const name = `${folderName}/${req.decoded.uid}/${utils.generateS3FileName(req, folderName)}.${extension}`;
        req.body.fileName = name;
        cb(null, name)
      }
    })
  });

  UploadToS3 = async (path: string, body: Buffer): Promise<IS3UploadOutput | never> => {
    try {
      const command = new PutObjectCommand({
        Bucket: this.AWS_S3_BUCKET_NAME,
        Key: path,
        Body: body,
      });
      const response = await this.client.send(command);
      return { ...response, ObjectURL: `${this.s3URL}/${path}` }
    } catch (err) {
      throw err
    }
  };

  getSignedUrl = async (path: string) => {
    try {
      const command: any = new PutObjectCommand({
        Bucket: this.AWS_S3_BUCKET_NAME,
        Key: path,
      });
      const url = await getSignedUrl(this.client, command, { expiresIn: 180 });
      return url
    } catch (error) {
      throw error
    }
  }
}

