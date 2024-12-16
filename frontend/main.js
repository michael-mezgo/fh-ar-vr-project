function startExperience() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('aframeScene').style.display = 'block';
    loadImages().catch(error => console.error('Error in startExperience:', error));
    setInterval(updateUserPosition, 10000); // update user position every 10 seconds
}

let imagesArray = [];
const MAX_DISTANCE = 30;
let firstUpdate = true;

async function loadImages() {
    try {
        // fetch images from API
        const response = await fetch('https://' + window.location.hostname + ':' + window.location.port +'/api/pictures');
        const data = await response.json();
        imagesArray = data;

        updateUserPosition();
    } catch (error) {
        console.error('Error loading images:', error);
    }
}

function updateUserPosition() {
    const scene = document.querySelector("a-scene");
    if (!firstUpdate) {
        // clear all groups
        Array.from(scene.querySelectorAll("[gps-new-entity-place]")).forEach(child => {
            scene.removeChild(child);
        });
    } else {
        firstUpdate = false;
    }

    // get user location
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLatitude = position.coords.latitude;
            const userLongitude = position.coords.longitude;

            // group images based on coordinates
            const groupedImages = groupImagesByLatLong(imagesArray);

            // iterate over each group
            for (const [latLongKey, imagesGroup] of Object.entries(groupedImages)) {
                const [latitude, longitude] = latLongKey.split(',').map(Number);
                const distance = calculateDistance(userLatitude, userLongitude, latitude, longitude);

                // only add if close to user
                if (distance <= MAX_DISTANCE) {
                    const groupEntity = createGroupEntity(latitude, longitude, imagesGroup);
                    scene.appendChild(groupEntity);
                }
            }
        }, (error) => {
            console.error('Error getting user location:', error);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

function groupImagesByLatLong(images) {
    // group by 4 digits after the comma
    return images.reduce((grouped, image) => {
        const key = `${image.latitude.toFixed(4)},${image.longitude.toFixed(4)}`;
        grouped[key] = grouped[key] || [];
        // push to group based on key
        grouped[key].push(image);
        return grouped;
    }, {});
}

function createGroupEntity(latitude, longitude, imagesGroup) {
    const groupEntity = document.createElement("a-entity");
    groupEntity.setAttribute("gps-new-entity-place", { latitude, longitude });

    // add each image to group
    imagesGroup.forEach((imageData, index) => {
        const img = document.createElement("a-image");
        img.setAttribute("src", imageData.src);
        img.setAttribute("width", "7.5");
        img.setAttribute("height", "11");
        img.setAttribute("look-at", "[gps-new-camera]");
        // offset to avoid overlapping
        img.object3D.position.set((index % 2 === 0 ? -1 : 1) * (index + 1) * 4, 0, 0);

        // caption text
        const text = createCaptionText(imageData.caption);
        img.appendChild(text);
        groupEntity.appendChild(img);
    });

    return groupEntity;
}

function createCaptionText(caption) {
    const text = document.createElement("a-text");
    text.setAttribute("value", caption);
    text.setAttribute("position", "0 -7 0");
    text.setAttribute("color", "#FFF");
    text.setAttribute("align", "center");
    text.setAttribute("scale", "4 4 2");
    text.setAttribute("look-at", "[gps-new-camera]");
    return text;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    // distance with Haversine formula
    const R = 6371e3; // radius of Earth
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}
