package at.fhcampuswien.di

import at.fhcampuswien.ConfigParameters
import at.fhcampuswien.data.PictureDataSource
import at.fhcampuswien.data.PictureDataSourceImpl
import at.fhcampuswien.data.PictureDatabaseEntry
import com.mongodb.client.model.IndexOptions
import com.mongodb.client.model.Indexes
import com.mongodb.kotlin.client.coroutine.MongoClient
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import io.minio.BucketExistsArgs
import io.minio.MakeBucketArgs
import io.minio.MinioClient
import kotlinx.coroutines.runBlocking
import org.koin.dsl.module

val mainModule = module {
    // Koin: https://youtu.be/Wa-e3IsNEeo?si=y0lQvd22p4VuVyDt
    single {
        connectToMongoDB()
    }
    single<PictureDataSource> {
        PictureDataSourceImpl(get())
    }
}

private fun connectToMongoDB(): MongoDatabase {
    val user = ConfigParameters.DbUser.value
    val password = ConfigParameters.DbPassword.value
    val host = ConfigParameters.DbHost.value
    val port = ConfigParameters.DbPort.value
    val maxPoolSize = ConfigParameters.DbPoolSize.value
    val databaseName = ConfigParameters.DbName.value

    val credentials = user?.let { userVal -> password?.let { passwordVal -> "$userVal:$passwordVal@" } }.orEmpty()
    val uri = "mongodb://$credentials$host:$port/?maxPoolSize=$maxPoolSize&w=majority"

    val mongoClient = MongoClient.create(uri)
    val database = mongoClient.getDatabase(databaseName)

    runBlocking {
        initDb(database)
    }
    initS3Store()

    return database
}

private suspend fun initDb(db: MongoDatabase) {
    db.createCollection(ConfigParameters.PictureBucket.value)

    // https://www.mongodb.com/docs/drivers/kotlin/coroutine/current/fundamentals/indexes/
    db.getCollection<PictureDatabaseEntry>(ConfigParameters.PictureBucket.value).createIndex(Indexes.ascending(PictureDatabaseEntry::pictureFileName.name), IndexOptions().unique(true))
}

private fun initS3Store() {
    val minioClient: MinioClient = MinioClient.builder()
        .endpoint(ConfigParameters.Endpoint.value)
        .credentials(ConfigParameters.AccessKey.value, ConfigParameters.SecretKey.value)
        .build()

    // https://min.io/docs/minio/linux/developers/java/minio-java.html#id6
    val found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(ConfigParameters.PictureBucket.value).build())
    if (!found) {
        minioClient.makeBucket(MakeBucketArgs.builder().bucket(ConfigParameters.PictureBucket.value).build())
    }
}