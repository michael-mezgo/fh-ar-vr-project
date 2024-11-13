package at.fhcampuswien.plugins

import at.fhcampuswien.routes.uploadPicture
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    routing {
        uploadPicture()
    }
}
