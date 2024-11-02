// Toggle between welcome screen and AR scene
function startExperience() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('aframeScene').style.display = 'block';
}

// Mock function to simulate fetching images near user's coordinates
function fetchNearbyImages(userLatitude, userLongitude) {
    // In production, this would be a real API call
    return [
        {
            src: "https://as2.ftcdn.net/v2/jpg/00/71/38/29/1000_F_71382959_eYupFs1L5m21OYLXope4K9HXar7HQKsv.jpg",
            caption: "A beautiful day here!",
            latitude: userLatitude + 0.0001,
            longitude: userLongitude + 0.0001,
        },
        {
            src: "https://as2.ftcdn.net/v2/jpg/01/83/98/81/1000_F_183988193_ihuHiHc4ZFiYqL3H4qZkDRAAb9HfGVHp.jpg",
            caption: "Hello from here!",
            latitude: userLatitude - 0.0001,
            longitude: userLongitude - 0.0001,
        },
        {
            src: "https://as2.ftcdn.net/v2/jpg/00/49/14/31/1000_F_49143198_5HdyJHUqgkAkbOELEsre7oH1c9MwfOQb.jpg",
            caption: "What a nice view!",
            latitude: userLatitude - 0.0001,
            longitude: userLongitude - 0.0001,
        }
    ];
}

// Load nearby images and display in AR scene
function loadImagesInScene(latitude, longitude) {
    const images = fetchNearbyImages(latitude, longitude);
    const scene = document.querySelector("a-scene");

    images.forEach((imageData) => {
        const imageEntity = document.createElement("a-entity");
        imageEntity.setAttribute("gps-new-entity-place", {
            latitude: imageData.latitude,
            longitude: imageData.longitude,
        });
        imageEntity.setAttribute("look-at", "[gps-new-camera]");

        // Image element
        const img = document.createElement("a-image");
        img.setAttribute("src", imageData.src);
        img.setAttribute("width", "1");
        img.setAttribute("height", "1.5");
        imageEntity.appendChild(img);

        // Text element
        const text = document.createElement("a-text");
        text.setAttribute("value", imageData.caption);
        text.setAttribute("position", "0 -0.8 0");
        text.setAttribute("color", "#FFF");
        text.setAttribute("align", "center");
        text.setAttribute("scale", "1.5 1.5 1");
        imageEntity.appendChild(text);

        scene.appendChild(imageEntity);
    });
}

// Update user's location and load images nearby
window.onload = () => {
    const camera = document.querySelector("[gps-new-camera]");
    camera.addEventListener("gps-camera-update-position", (e) => {
        const latitude = e.detail.position.latitude;
        const longitude = e.detail.position.longitude;

        document.getElementById("debug").innerText = `GPS position updated: ${latitude}, ${longitude}`;

        // Call function to load images nearby
        loadImagesInScene(latitude, longitude);
    });

    camera.addEventListener("gps-camera-error", (e) => {
        document.getElementById("debug").innerText = "GPS error: " + e.detail.error.message;
    });
};
