const cameraView = document.getElementById("cameraView");
const captureButton = document.getElementById("captureButton");
const uploadButton = document.getElementById("uploadButton");
const retakeButton = document.getElementById("retakeButton");
const preview = document.getElementById("preview");
let photoBlob = null;
let currentLat = null;
let currentLon = null;

async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraView.srcObject = stream;
    } catch (error) {
        console.error("Error accessing the camera:", error);
    }
}

captureButton.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    canvas.width = cameraView.videoWidth;
    canvas.height = cameraView.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(cameraView, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
        photoBlob = blob;
        preview.src = URL.createObjectURL(photoBlob);
        preview.style.display = "block";
        cameraView.style.display = "none";
        uploadButton.disabled = false;
        captureButton.style.display = "none";
        retakeButton.style.display = "inline";
    }, "image/jpeg");
});


retakeButton.addEventListener("click", () => {
    preview.style.display = "none";
    cameraView.style.display = "block";
    captureButton.style.display = "inline";
    retakeButton.style.display = "none";
    uploadButton.disabled = true;
    photoBlob = null;
});


async function getCurrentLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLat = position.coords.latitude;
                currentLon = position.coords.longitude;
                console.log(`Current Latitude: ${currentLat}, Current Longitude: ${currentLon}`);
            },
            (error) => console.error("Error getting location:", error)
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}


uploadButton.addEventListener("click", async () => {
    if (!photoBlob || currentLat === null || currentLon === null) {
        alert("Photo or location data is missing.");
        return;
    }

    const formData = new FormData();
    formData.append("photo", photoBlob, "photo.jpg");
    formData.append("latitude", currentLat);
    formData.append("longitude", currentLon);

    try {
        const response = await fetch("", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("Photo uploaded successfully!");
        } else {
            alert("Failed to upload photo.");
        }
    } catch (error) {
        console.error("Error uploading photo:", error);
    }
});

setupCamera();
getCurrentLocation();
