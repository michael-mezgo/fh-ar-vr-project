package at.fhcampuswien.data

import at.fhcampuswien.ConfigParameters
import at.fhcampuswien.dto.ImageData
import at.fhcampuswien.dto.PictureUploadDto
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import io.minio.GetObjectArgs
import io.minio.MinioClient
import io.minio.PutObjectArgs
import io.minio.StatObjectArgs
import kotlinx.coroutines.flow.toList
import java.io.ByteArrayInputStream
import java.util.*

class PictureDataSourceImpl(
    private val db: MongoDatabase
) : PictureDataSource {
    private val minioClient: MinioClient = MinioClient.builder()
        .endpoint(ConfigParameters.Endpoint.value)
        .credentials(ConfigParameters.AccessKey.value, ConfigParameters.SecretKey.value)
        .build()

    override suspend fun insertPicture(picture: PictureUploadDto) {
        val image = pictureBase64ToBytes(picture.picture, UUID.randomUUID().toString())

        // https://youtube.com/playlist?list=PLFOIsHSSYIK3Dd3Y_x7itJT1NUKT5SxDh&si=JQDBboSClHBrWWo5
        val args = PutObjectArgs.builder()
            .bucket(ConfigParameters.PictureBucket.value)
            .contentType(image.contentType)
            .`object`(image.fileName)
            .stream(ByteArrayInputStream(image.bytes), image.bytes.count().toLong(), -1)
            .build()
        minioClient.putObject(args)

        db
            .getCollection<PictureDatabaseEntry>(ConfigParameters.PictureBucket.value)
            .insertOne(PictureDatabaseEntry(userUuid = picture.userUuid, longitude = picture.longitude, latitude = picture.latitude, pictureFileName = image.fileName))
    }

    override suspend fun getAllPictures(): List<PictureUploadDto> {
        val result = mutableListOf<PictureUploadDto>()

        val dbImages = mutableListOf<PictureDatabaseEntry>()
            db.getCollection<PictureDatabaseEntry>(ConfigParameters.PictureBucket.value)
                .find()
                .toList(dbImages)

        dbImages.forEach { dbEntry ->
            val args = GetObjectArgs.builder()
                .bucket(ConfigParameters.PictureBucket.value)
                .`object`(dbEntry.pictureFileName)
                .build()

            val statArgs = StatObjectArgs.builder()
                .bucket(ConfigParameters.PictureBucket.value)
                .`object`(dbEntry.pictureFileName)
                .build()

            val stream = minioClient.getObject(args)
            val stats = minioClient.statObject(statArgs)

            val type = stats.contentType()

            val bytes = stream.readAllBytes()

            val dto = PictureUploadDto (
                userUuid = dbEntry.userUuid,
                longitude = dbEntry.longitude,
                latitude = dbEntry.latitude,
                picture = "data:$type;base64,${pictureToBase64(bytes)}"
            )

            result.add(dto)
        }

        return result
    }

    private fun pictureBase64ToBytes(string: String, name: String) : ImageData {
        val base64parts = string.split(",")
        val bytes = Base64.getDecoder().decode(base64parts[1])
        val type = base64parts[0].split(":")[1].split(";")[0]

        return ImageData(name, type, bytes)
    }

    private fun pictureToBase64(bytes: ByteArray): String {
        return Base64.getEncoder().encodeToString(bytes)
    }

}