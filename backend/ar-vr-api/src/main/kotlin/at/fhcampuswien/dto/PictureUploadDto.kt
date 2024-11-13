package at.fhcampuswien.dto

import kotlinx.serialization.Serializable

@Serializable
data class PictureUploadDto(
    val longitude: Double,
    val latitude: Double,
    val picture: String
)
