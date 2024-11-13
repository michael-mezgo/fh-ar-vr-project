package at.fhcampuswien.data

import at.fhcampuswien.dto.ImageData
import at.fhcampuswien.dto.PictureUploadDto
import io.minio.MinioClient
import io.minio.PutObjectArgs
import java.io.ByteArrayInputStream
import java.util.*

class PictureDataSourceImpl(
) : PictureDataSource {
    private val minioClient: MinioClient = MinioClient.builder()
        .endpoint("http://127.0.0.1:9000")
        .credentials("Zeq92ZKD0Zz71tone0r5", "uCbpoBP5nUQJKMim14VIT2ftDXCIN6bZ3u99oLZU")
        .build()

    override suspend fun insertPicture(picture: PictureUploadDto) {
        val image = pictureBase64ToBytes(picture.picture, UUID.randomUUID().toString())

        // https://youtube.com/playlist?list=PLFOIsHSSYIK3Dd3Y_x7itJT1NUKT5SxDh&si=JQDBboSClHBrWWo5
        val args = PutObjectArgs.builder()
            .bucket("instapicture")
            .contentType(image.contentType)
            .`object`(image.fileName)
            .stream(ByteArrayInputStream(image.bytes), image.bytes.count().toLong(), -1)
            .build()
        minioClient.putObject(args)
    }

    private fun pictureBase64ToBytes(string: String, name: String) : ImageData {
        val base64parts = string.split(",")
        val bytes = Base64.getDecoder().decode(base64parts[1])
        val type = base64parts[0].split(":")[1].split(";")[0]

        return ImageData(name, type, bytes)
    }

}