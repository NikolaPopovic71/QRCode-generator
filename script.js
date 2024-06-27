function showFields(type) {
  document.getElementById("urlFields").style.display = "none";
  document.getElementById("textFields").style.display = "none";
  document.getElementById("vcardFields").style.display = "none";

  if (type === "url") {
    document.getElementById("urlFields").style.display = "block";
  } else if (type === "text") {
    document.getElementById("textFields").style.display = "block";
  } else if (type === "vcard") {
    document.getElementById("vcardFields").style.display = "block";
  }
}

function generateQRCode() {
  const qrType = document.querySelector('input[name="qrType"]:checked').value;
  const lightColor = document.getElementById("lightColor").value.slice(1);
  const darkColor = document.getElementById("darkColor").value.slice(1);
  const qrSize = parseInt(document.getElementById("qrSize").value, 10);

  let qrData = "";

  if (qrType === "URL") {
    const urlInput = document.getElementById("urlInput").value;
    if (!urlInput) {
      displayErrorMessage("Please enter a URL.");
      return;
    }
    qrData = urlInput;
  } else if (qrType === "Text") {
    const textInput = document.getElementById("textInput").value;
    if (!textInput) {
      displayErrorMessage("Please enter some text.");
      return;
    }
    qrData = textInput;
  } else if (qrType === "VCard") {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const mobile = document.getElementById("mobile").value;
    const phone = document.getElementById("phone").value;
    const fax = document.getElementById("fax").value;
    const email = document.getElementById("email").value;
    const company = document.getElementById("company").value;
    const jobPosition = document.getElementById("jobPosition").value;
    const street = document.getElementById("street").value;
    const zip = document.getElementById("zip").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const country = document.getElementById("country").value;
    const website = document.getElementById("website").value;

    qrData = `BEGIN:VCARD
VERSION:3.0
FN:${firstName} ${lastName}
N:${lastName};${firstName};;;
TEL;TYPE=CELL:${mobile}
TEL;TYPE=VOICE:${phone}
TEL;TYPE=FAX:${fax}
EMAIL:${email}
ORG:${company}
TITLE:${jobPosition}
ADR;TYPE=WORK:;;${street};${city};${state};${zip};${country}
URL:${website}
END:VCARD`;
  }

  if (!isLightColorLighter(lightColor, darkColor)) {
    alert(
      "The light color must be lighter than the dark color. Please choose appropriate colors."
    );
    return;
  }

  if (qrData.length > 1500) {
    displayErrorMessage("Maximum 1500 alphanumeric characters are allowed.");
    return;
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    qrData
  )}&size=${qrSize}x${qrSize}&color=${darkColor}&bgcolor=${lightColor}`;

  const qrcodeContainer = document.getElementById("qrcode");
  qrcodeContainer.innerHTML = "";
  const img = document.createElement("img");
  img.src = qrUrl;
  qrcodeContainer.appendChild(img);

  img.onload = () => {
    const qrcodeRect = qrcodeContainer.getBoundingClientRect();
    const scrollPosition =
      window.scrollY +
      qrcodeRect.top -
      (window.innerHeight - qrcodeRect.height) / 2;
    window.scrollTo({ top: scrollPosition, behavior: "smooth" });
  };
}

function displayErrorMessage(message) {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

function clearQRCode() {
  document.getElementById("urlInput").value = "";
  document.getElementById("textInput").value = "";
  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("mobile").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("fax").value = "";
  document.getElementById("email").value = "";
  document.getElementById("company").value = "";
  document.getElementById("jobPosition").value = "";
  document.getElementById("street").value = "";
  document.getElementById("zip").value = "";
  document.getElementById("city").value = "";
  document.getElementById("state").value = "";
  document.getElementById("country").value = "";
  document.getElementById("website").value = "";
  document.getElementById("qrcode").innerHTML = "";
  document.getElementById("errorMessage").style.display = "none";
  document.getElementById("lightColor").value = "#ffffff";
  document.getElementById("darkColor").value = "#000000";
}

function isLightColorLighter(lightColor, darkColor) {
  const lightLuminance = getLuminance(lightColor);
  const darkLuminance = getLuminance(darkColor);
  return lightLuminance > darkLuminance;
}

function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  const [r, g, b] = rgb.map((value) => {
    value /= 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex) {
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function copyPNG() {
  const imgElement = document.querySelector("#qrcode img");
  if (imgElement) {
    fetch(imgElement.src)
      .then((res) => res.blob())
      .then((blob) => {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard
          .write([item])
          .then(() => alert("PNG copied to clipboard."))
          .catch((err) => console.error("Could not copy image: ", err));
      });
  } else {
    alert("No QR code to copy.");
  }
}

function downloadPNG() {
  const imgElement = document.querySelector("#qrcode img");
  if (imgElement) {
    const link = document.createElement("a");
    link.href = imgElement.src;
    link.download = "qrcode.png";
    link.target = "_blank"; // Ensure the link opens in a new tab
    link.click();
  } else {
    alert("No QR code to download.");
  }
}

function shareQRCode() {
  const imgElement = document.querySelector("#qrcode img");
  if (imgElement) {
    fetch(imgElement.src)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "qrcode.png", { type: "image/png" });
        navigator
          .share({
            files: [file],
            title: "QR Code",
            text: "Check out this QR code!",
          })
          .then(() => console.log("Share was successful."))
          .catch((error) => console.log("Sharing failed", error));
      });
  } else {
    alert("No QR code to share.");
  }
}

function todayDate() {
  const d = new Date();
  const n = d.getFullYear() + "  ";
  document.getElementById("date").innerHTML = n;
}
