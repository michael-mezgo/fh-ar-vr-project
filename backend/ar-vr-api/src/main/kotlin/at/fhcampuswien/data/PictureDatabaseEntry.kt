package at.fhcampuswien.data

import kotlinx.serialization.Serializable

@Serializable
data class PictureDatabaseEntry(
    val userUuid: String,
    val longitude: Double,
    val latitude: Double,
    val pictureFileName: String
)