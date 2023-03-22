const File = require('../fileupload/fileModel')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../../errors')
const { ObjectId } = require('mongodb');

const fileupload = async (req, res) => {
  const gfs = req.gfs;
  const file = req.files.file;
  //console.log(req.query.appID)
  
  const uploadStream = gfs.openUploadStream(file.name);
  uploadStream.write(file.data);
  uploadStream.end();

  uploadStream.on('finish', () => {
    const newFile = new File({
      doc_id: uploadStream.id,
      length: file.size,
      name: file.name,  
      type: file.mimetype,
      applicationID: req.query.appID


    });
    newFile.save()
      .then(_ => res.json({
        success: true,
        message: "File was saved with success"
      }))
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: `Error while uploading new files, with error: ${err}`
        });
      });
  });
};

const filedownload = async (req, res) => {
  console.log(req.params.id)
  const gfs = req.gfs;
  const fileId = req.params.id;

  // Check if the provided ID is a valid ObjectID
  if (!ObjectId.isValid(fileId)) {
    return res.status(400).json({ message: 'Invalid file ID' });
  }

  try {
    //const file = await gfs.find({ _id: ObjectId(fileId) }).toArray();
    const file = await File.findOne({ applicationID: fileId });

    const docID = file.doc_id
    // Check if file exists
    if (!file || file.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    const readStream = gfs.openDownloadStream(new ObjectId(docID));

    // Set the content-type header to the file's MIME type
    res.setHeader('Content-Type', 'arrayBuffer');
  res.setHeader('Content-Disposition', 'inline; filename="' + file.filename + '"');
    // Send the file in the response
    readStream.pipe(res);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  fileupload,
  filedownload,
}