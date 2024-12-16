package at.fhcampuswien.dto

import kotlinx.serialization.Serializable

@Serializable
data class PictureDownloadDto(
    val userUuid: String,
    val longitude: Double,
    val latitude: Double,
    val src: String,
    val caption: String
)