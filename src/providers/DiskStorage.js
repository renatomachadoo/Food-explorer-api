const fs = require("fs")
const path = require("path")
const uploadConfig = require("../configs/upload")

class DiskStorage{
    async saveFile(file){
        // THE MULTER WILL UPLOAD THE FILE TO TMP_FOLDER AND HERE WE WILL MOVE FROM THE FILE FROM TMP_FOLDER TO UPLOADS_FOLDER
        await fs.promises.rename(
            path.resolve(uploadConfig.TMP_FOLDER, file),
            path.resolve(uploadConfig.UPLOADS_FOLDER, file)
        )
        return file
    }

    async deleteFile(file){
        const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)

        try {
            await fs.promises.stat(filePath) // VALIDATE THE FILE IF ITS POSSIBLE TO EXCLUDE...
        } catch (error) {
            return // IF NOT THE FUNCTION STOPS
        }

        await fs.promises.unlink(filePath)
    }

    async deleteTmpFile(file){
        const filePath = path.resolve(uploadConfig.TMP_FOLDER, file)

        try {
            await fs.promises.stat(filePath) // VALIDATE THE FILE IF ITS POSSIBLE TO EXCLUDE...
        } catch (error) {
            return // IF NOT THE FUNCTION STOPS
        }

        await fs.promises.unlink(filePath)
    }
}

module.exports = DiskStorage