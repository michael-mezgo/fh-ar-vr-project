package at.fhcampuswien

sealed class ConfigParameters(val value: String) {
    data object Endpoint : ConfigParameters(value = "http://192.168.246.90:9000")
    data object AccessKey : ConfigParameters(value = "Zeq92ZKD0Zz71tone0r5")
    data object SecretKey : ConfigParameters(value = "uCbpoBP5nUQJKMim14VIT2ftDXCIN6bZ3u99oLZU")
    data object PictureBucket : ConfigParameters(value = "instapictures")

    data object DbUser : ConfigParameters(value = "admin")
    data object DbPassword : ConfigParameters(value = "password")
    data object DbHost : ConfigParameters(value = "192.168.246.17")
    data object DbPort : ConfigParameters(value = "27017")
    data object DbName : ConfigParameters(value = "insta_db")
    data object DbPoolSize : ConfigParameters(value = "20")
}