package at.fhcampuswien.routes

import at.fhcampuswien.data.PictureDataSource
import at.fhcampuswien.dto.PictureUploadDto
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Routing.uploadPicture(dataSourceImpl: PictureDataSource) {
    post(path = "/api/uploadPicture") {
        val uploadDate = call.receive<PictureUploadDto>()

        dataSourceImpl.insertPicture(uploadDate)
        
        call.response.status(HttpStatusCode.OK)
    }
}

fun Routing.getAllPictures(dataSourceImpl: PictureDataSource) {
    get(path = "/api/pictures") {
        val result = dataSourceImpl.getAllPictures()

        call.respond(result)
    }
}