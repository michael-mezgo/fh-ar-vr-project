function startExperience() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('aframeScene').style.display = 'block';
    loadImages();
}

const lat = 48.158145
const lon = 16.381274

const imagesArray = [
    {
        src: "https://as2.ftcdn.net/v2/jpg/00/71/38/29/1000_F_71382959_eYupFs1L5m21OYLXope4K9HXar7HQKsv.jpg",
        caption: "A beautiful day here!",
        latitude: lat,
        longitude: lon
    },
    {
        src: "https://as2.ftcdn.net/v2/jpg/01/83/98/81/1000_F_183988193_ihuHiHc4ZFiYqL3H4qZkDRAAb9HfGVHp.jpg",
        caption: "Hello from here!",
        latitude: lat,
        longitude: lon
    },
    {
        src: "https://as2.ftcdn.net/v2/jpg/00/49/14/31/1000_F_49143198_5HdyJHUqgkAkbOELEsre7oH1c9MwfOQb.jpg",
        caption: "What a nice view!",
        latitude: lat,
        longitude: lon
    },
    {
        src: "https://as2.ftcdn.net/v2/jpg/00/70/88/07/1000_F_70880772_7JFkehQCDV81ALUhic4CpCrCr8skuy0s.jpg",
        caption: "Whats up!",
        latitude: lat,
        longitude: lon
    },
    {
        src: "https://as2.ftcdn.net/v2/jpg/00/48/88/49/1000_F_48884911_sD1WzCWgPTHmlJ9Lsgiw3OnV6FrmZ88I.jpg",
        caption: "I'm soo cool!",
        latitude: lat,
        longitude: lon
    },
    {
        src: "https://as1.ftcdn.net/v2/jpg/04/21/00/54/1000_F_421005472_GJR2bkRLvY1uupdBIyKGZknTWsl0dWik.jpg",
        caption: "This is crazy!",
        latitude: lat,
        longitude: lon
    },

];

function loadImages() {
    const scene = document.querySelector("a-scene");
    const radius = 20

    imagesArray.forEach((imageData, index) => {
        const imageEntity = document.createElement("a-entity");
        imageEntity.setAttribute("gps-new-entity-place", {
            latitude: imageData.latitude,
            longitude: imageData.longitude
        });

        const img = document.createElement("a-image");
        img.setAttribute("src", imageData.src);
        img.setAttribute("width", "7.5");
        img.setAttribute("height", "11");
        img.setAttribute("look-at", "[gps-new-camera]");

        const angle = (2 * Math.PI * index) / 10;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        img.object3D.position.set(x, 0, z);

        imageEntity.appendChild(img);

        const text = document.createElement("a-text");
        text.setAttribute("value", imageData.caption);
        text.setAttribute("position", `0 -7 0`);
        text.setAttribute("color", "#FFF");
        text.setAttribute("align", "center");
        text.setAttribute("scale", "4 4 2");
        text.setAttribute("look-at", "[gps-new-camera]");
        img.appendChild(text);

        scene.appendChild(imageEntity);
    });

}