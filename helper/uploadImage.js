const AWS = require("aws-sdk");

const uploadImage = async (file) => {
  const bucketName = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_REGION;
  const s3 = new AWS.S3({
    region,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });
  const fileName = `kandoi/${Date.now()}-${file.originalname}`;

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer, 
    ContentType: file.mimetype, 
  };

  try {
    const data = await s3.upload(params).promise();
    console.log("S3 Upload Data:", data);
    return data.Location; 
  } catch (err) {
    console.error("Error uploading to S3:", err);
    throw new Error("File upload failed");
  }
};

module.exports = { uploadImage };
