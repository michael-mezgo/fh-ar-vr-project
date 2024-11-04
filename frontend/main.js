let coordinatesText;

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
    }
];

function loadImages() {
    const scene = document.querySelector("a-scene");

    imagesArray.forEach((imageData, index) => {
        const imageEntity = document.createElement("a-entity");
        imageEntity.setAttribute("gps-new-entity-place", {
            latitude: imageData.latitude,
            longitude: imageData.longitude
        });

        const img = document.createElement("a-image");
        img.setAttribute("src", imageData.src);
        img.setAttribute("width", "5");
        img.setAttribute("height", "7.5");
        img.setAttribute("look-at", "[gps-new-camera]");

        imageEntity.appendChild(img);

        const offset = index * 10;
        //imageEntity.setAttribute("position", `15, ${offset}, 0`);
        imageEntity.object3D.position.set(lat + 0.00002, 0, 0);


        const text = document.createElement("a-text");
        text.setAttribute("value", imageData.caption);
        text.setAttribute("position", `0 0 ${offset}`);
        text.setAttribute("color", "#FFF");
        text.setAttribute("align", "center");
        text.setAttribute("scale", "3 3 2");
        text.setAttribute("look-at", "[gps-new-camera]");
        imageEntity.appendChild(text);

        scene.appendChild(imageEntity);
    });
}

window.onload = () => {
    const camera = document.querySelector("[gps-new-camera]");
    coordinatesText = document.getElementById("coordinates");

    camera.addEventListener("gps-camera-update-position", (e) => {
        const latitude = e.detail.position.latitude;
        const longitude = e.detail.position.longitude;

        coordinatesText.setAttribute("value", `Latitude: ${latitude.toFixed(4)}\nLongitude: ${longitude.toFixed(4)}`);
    });
};
