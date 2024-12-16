package at.fhcampuswien.dto

import kotlinx.serialization.Serializable

@Serializable
data class PictureUploadDto(
    val userUuid: String,
    val longitude: Double,
    val latitude: Double,
    val picture: String,
    val caption: String
)
