package at.fhcampuswien.plugins

import at.fhcampuswien.data.PictureDataSource
import at.fhcampuswien.routes.getAllPictures
import at.fhcampuswien.routes.uploadPicture
import io.ktor.server.application.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

fun Application.configureRouting() {
    val pictureDataSourceImpl by inject<PictureDataSource>()
    routing {
        uploadPicture(dataSourceImpl = pictureDataSourceImpl)
        getAllPictures(dataSourceImpl = pictureDataSourceImpl)
    }
}
