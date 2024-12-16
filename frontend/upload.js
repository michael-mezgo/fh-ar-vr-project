const cameraView = document.getElementById("cameraView");
const backButton = document.getElementById("backButton");
const captureButton = document.getElementById("captureButton");
const uploadButton = document.getElementById("uploadButton");
const retakeButton = document.getElementById("retakeButton");
const preview = document.getElementById("preview");
const cameraContainer = document.getElementById("cameraContainer")
let photoBlob = null;
let currentLat = null;
let currentLon = null;
let uniqueDeviceId = localStorage.getItem("uniqueDeviceId");
const captionContainer = document.getElementById("captionContainer");
const captionInput = document.getElementById("captionInput");


if (!uniqueDeviceId) {
    uniqueDeviceId = crypto.randomUUID();
    localStorage.setItem("uniqueDeviceId", uniqueDeviceId);
}

async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraView.srcObject = stream;
    } catch (error) {
        console.error("Error accessing the camera:", error);
        alert("Kamera konnte nicht gestartet werden. Bitte überprüfen Sie die Berechtigungen.");
    }
}

captureButton.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    canvas.width = cameraView.videoWidth;
    canvas.height = cameraView.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(cameraView, 0, 0, canvas.width, canvas.height);
    captionContainer.style.display = "block";

    // cameraContainer.createElement(retakeButton)

    preview.style.display = "block";
    cameraView.style.display = "none";
    backButton.style.display = "none";
    uploadButton.style.display = "inline";
    captureButton.style.display = "none";
    retakeButton.style.display = "inline";

    canvas.toBlob((blob) => {
        photoBlob = blob;
        preview.src = URL.createObjectURL(photoBlob);
    }, "image/jpeg");
});


retakeButton.addEventListener("click", () => {
    preview.style.display = "none";
    cameraView.style.display = "block";
    backButton.style.display = "inline"
    captureButton.style.display = "inline";
    retakeButton.style.display = "none";
    uploadButton.style.display = "none"
    photoBlob = null;
    captionContainer.style.display = "none";
    captionInput.value = "";
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

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

uploadButton.addEventListener("click", async () => {
    let captionText = captionInput.value.trim();
    console.log(captionText);

    if (!photoBlob || currentLat === null || currentLon === null) {
        alert("Photo or location data is missing.");
        return;
    }

    if (!captionText) {
        captionText = " ";
    }

    try {
        const base64String = await blobToBase64(photoBlob);

        const photoData = {
            userUuid: uniqueDeviceId,
            longitude: currentLon,
            latitude: currentLat,
            picture: base64String,
            caption: captionText,
        }
        const response = await fetch("https://" + window.location.hostname + ":" + window.location.port +"/api/uploadPicture", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(photoData),
        });

        if (response.ok) {
            alert("Photo uploaded successfully!");
            captionInput.value = "";
            retakeButton.click();
        } else {
            alert("Failed to upload photo.");
        }
    } catch (error) {
        console.error("Error uploading photo:", error);
    }
});

setupCamera();
getCurrentLocation();
