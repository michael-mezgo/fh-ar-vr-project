function startExperience() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('aframeScene').style.display = 'block';
    loadImages();
}

const imagesArray = [
    {
        src: "https://as2.ftcdn.net/v2/jpg/00/71/38/29/1000_F_71382959_eYupFs1L5m21OYLXope4K9HXar7HQKsv.jpg",
        caption: "A beautiful day here!",
        latitude: 48.207786,
        longitude: 16.347853
    },
    {
        src: "https://as2.ftcdn.net/v2/jpg/01/83/98/81/1000_F_183988193_ihuHiHc4ZFiYqL3H4qZkDRAAb9HfGVHp.jpg",
        caption: "Hello from here!",
        latitude: 48.207786,
        longitude: 16.347854
    },
    {
        src: "https://as2.ftcdn.net/v2/jpg/00/49/14/31/1000_F_49143198_5HdyJHUqgkAkbOELEsre7oH1c9MwfOQb.jpg",
        caption: "What a nice view!",
        latitude: 48.207786,
        longitude: 16.347852
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
        img.setAttribute("width", "8");
        img.setAttribute("height", "13");
        img.setAttribute("look-at", "[gps-new-camera]");

        const verticalOffset = index * 15;
        imageEntity.setAttribute("position", `0 ${verticalOffset} 0`);

        imageEntity.appendChild(img);

        const text = document.createElement("a-text");
        text.setAttribute("value", imageData.caption);
        text.setAttribute("position", `0 0 ${verticalOffset}`);
        text.setAttribute("color", "#FFF");
        text.setAttribute("align", "center");
        text.setAttribute("scale", "3 3 2");
        text.setAttribute("look-at", "[gps-new-camera]");
        imageEntity.appendChild(text);

        scene.appendChild(imageEntity);
    });
}
