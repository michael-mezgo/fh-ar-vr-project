package at.fhcampuswien.plugins

import io.ktor.server.application.*
import io.ktor.server.plugins.compression.*
import io.ktor.server.response.*

fun Application.configureHTTP() {
    install(Compression)
}
