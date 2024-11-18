package at.fhcampuswien.dto

data class ImageData(
    val fileName: String,
    val contentType: String,
    val bytes: ByteArray
)
