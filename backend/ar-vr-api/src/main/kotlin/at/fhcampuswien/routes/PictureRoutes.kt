package at.fhcampuswien.routes

import at.fhcampuswien.data.PictureDataSource
import at.fhcampuswien.dto.PictureUploadDto
import io.ktor.server.request.*
import io.ktor.server.routing.*

fun Routing.uploadPicture(dataSourceImpl: PictureDataSource) {
    post(path = "/uploadPicture") {
        val uploadDate = call.receive<PictureUploadDto>()

        dataSourceImpl.insertPicture(uploadDate)
    }
}