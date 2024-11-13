package at.fhcampuswien.routes

import at.fhcampuswien.data.PictureDataSourceImpl
import at.fhcampuswien.dto.PictureUploadDto
import io.ktor.server.request.*
import io.ktor.server.routing.*

fun Routing.uploadPicture() {
    post(path = "/uploadPicture") {
        val uploadDate = call.receive<PictureUploadDto>()

        val dataSrc = PictureDataSourceImpl()
        dataSrc.insertPicture(uploadDate)
    }
}