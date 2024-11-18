package at.fhcampuswien.data

import at.fhcampuswien.dto.PictureUploadDto

interface PictureDataSource {
    suspend fun insertPicture(picture: PictureUploadDto)
    suspend fun getAllPictures() : List<PictureUploadDto>
}