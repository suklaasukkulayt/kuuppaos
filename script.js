var currentTime = "";

      function timeUpdate() {
      currentTime = new Date().toLocaleString();
      var timeText = document.querySelector("#timebarElement");
      if (timeText) {
        timeText.innerHTML = currentTime;
      }

      var downloadLink = document.querySelector("#downloadLink");
      if (downloadLink) {
        var downloadName = "kuuppaos_painting_" + currentTime.replace(/[^a-zA-Z0-9.-]/g, "_") + ".png";
        downloadLink.setAttribute("download", downloadName);
      }
      }
      setInterval(timeUpdate, 1000);

// Make the DIV element draggable:
dragElement(document.getElementById("welcome"));

// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
  // Step 2: Set up variables to keep track of the element's position.
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  // Step 3: Check if there is a special header element associated with the draggable element.
  if (document.getElementById(element.id + "header")) {
    // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
    // This allows you to drag the window around by its header.
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
    // This allows you to drag the window by holding down anywhere on the window.
    element.onmousedown = startDragging;
  }

  // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 7: Get the mouse cursor position at startup.
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 10: Calculate the new cursor position.
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;

    var nextTop = element.offsetTop - currentY;
    var nextLeft = element.offsetLeft - currentX;
    var minTop = element.offsetHeight / 2;
    var minLeft = element.offsetWidth / 2;
    var maxTop = window.innerHeight - element.offsetHeight / 2;
    var maxLeft = window.innerWidth - element.offsetWidth / 2;

    // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
    element.style.top = Math.max(minTop, Math.min(nextTop, maxTop)) + "px";
    element.style.left = Math.max(minLeft, Math.min(nextLeft, maxLeft)) + "px";
  }

  // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


var STORAGE_BG = "kuuppaos-bg-image";
var STORAGE_BLUR = "kuuppaos-blur";
var STORAGE_TRANSPARENT = "kuuppaos-transparent";

function saveSettings(bgImage, blur, transparent) {
  if (bgImage) {
    localStorage.setItem(STORAGE_BG, bgImage);
  }
  localStorage.setItem(STORAGE_BLUR, String(blur));
  localStorage.setItem(STORAGE_TRANSPARENT, String(transparent));
}

function loadSettings() {
  var savedBg = localStorage.getItem(STORAGE_BG);
  var savedBlur = localStorage.getItem(STORAGE_BLUR);
  var savedTransparent = localStorage.getItem(STORAGE_TRANSPARENT);

  if (savedBg) {
    applyWallpaper(savedBg);
  }

  if (blurInput && savedBlur !== null) {
    blurInput.value = savedBlur;
    updateBlurDisplay(Number(savedBlur));
  }

  if (transparentInput && savedTransparent !== null) {
    transparentInput.value = savedTransparent;
    updateTransparentDisplay(Number(savedTransparent));
  }
}

function clearSavedWallpaper() {
  localStorage.removeItem(STORAGE_BG);
}

var welcomeScreen = document.querySelector("#welcome")
var body = document.body;
var defaultBackgroundImage = body.style.backgroundImage || "";
var defaultBackgroundColor = body.style.backgroundColor || "antiquewhite";
var defaultBackgroundSize = body.style.backgroundSize || "cover";
var defaultBackgroundPosition = body.style.backgroundPosition || "";
var fileInput = document.getElementById("bgFile");
var applyStyleBtn = document.getElementById("applyStyleBtn");
var resetWallpaperBtn = document.getElementById("resetWallpaperBtn");
var blurInput = document.getElementById("blurInput");
var blurValue = document.getElementById("blurValue");
var transparentInput = document.getElementById("transparentInput");
var transparentValue = document.getElementById("transparentValue");

function applyWallpaper(imageDataUrl) {
  if (!body) {
    return;
  }

  if (imageDataUrl) {
    body.style.backgroundImage = `url(${imageDataUrl})`;
  } else {
    body.style.backgroundImage = defaultBackgroundImage;
  }

  body.style.backgroundColor = defaultBackgroundColor;
  body.style.backgroundSize = "cover";
  body.style.backgroundPosition = "center";
}

function resetWallpaper() {
  if (!body) {
    return;
  }

  body.style.backgroundImage = defaultBackgroundImage;
  body.style.backgroundColor = defaultBackgroundColor;
  body.style.backgroundSize = defaultBackgroundSize;
  body.style.backgroundPosition = defaultBackgroundPosition;
}

function updateBlurDisplay(value) {
  const blurAmount = Number.isFinite(value) ? value : 0;
  document.documentElement.style.setProperty("--desktop-blur", `${blurAmount}px`);

  if (blurValue) {
    blurValue.textContent = `${blurAmount}px`;
  }
}

function updateTransparentDisplay(value) {
  const transparentAmount = Number.isFinite(value) ? value : 0;
  const alpha = Math.max(0, Math.min(1, transparentAmount / 100));
  document.documentElement.style.setProperty("--desktop-window-alpha", alpha.toFixed(2));

  if (transparentValue) {
    transparentValue.textContent = `${Math.round(alpha * 100)}%`;
  }
}

if (fileInput) {
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => applyWallpaper(reader.result);
    reader.readAsDataURL(file);
  });
}

if (applyStyleBtn) {
  applyStyleBtn.addEventListener("click", () => {
    const file = fileInput && fileInput.files ? fileInput.files[0] : null;

    if (!file) {
      resetWallpaper();
      clearSavedWallpaper();
      saveSettings(null, Number(blurInput.value), Number(transparentInput.value));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      applyWallpaper(reader.result);
      saveSettings(reader.result, Number(blurInput.value), Number(transparentInput.value));
    };
    reader.readAsDataURL(file);
  });
}

if (resetWallpaperBtn) {
  resetWallpaperBtn.addEventListener("click", () => {
    resetWallpaper();
    clearSavedWallpaper();
    saveSettings(null, Number(blurInput.value), Number(transparentInput.value));
  });
}

if (blurInput) {
  blurInput.addEventListener("input", (event) => {
    var value = parseInt(event.target.value, 10);
    updateBlurDisplay(value);
    localStorage.setItem(STORAGE_BLUR, String(value));
  });
}

if (transparentInput) {
  transparentInput.addEventListener("input", (event) => {
    var value = parseInt(event.target.value, 10);
    updateTransparentDisplay(value);
    localStorage.setItem(STORAGE_TRANSPARENT, String(value));
  });
}

loadSettings();
updateBlurDisplay(Number(blurInput && blurInput.value ? blurInput.value : 0));
updateTransparentDisplay(Number(transparentInput && transparentInput.value ? transparentInput.value : 0));

function closeWindow(element) {
  if (!element) return;

    element.classList.remove("opening");
    void element.offsetWidth;
    element.classList.add("closing");
    setTimeout(function () {
        element.style.display = "none";
        element.classList.remove("closing");
    }, 350);
}

var welcomeScreenClose = document.querySelector("#welcomeclose")

var welcomeScreenOpen = document.querySelector("#settingsButton")
var calendarScreen = document.querySelector("#calendar")
var calendarScreenOpen = document.querySelector("#timebarElement")

welcomeScreenClose.addEventListener("click", function() {
  closeWindow(welcomeScreen);
});

welcomeScreenOpen.addEventListener("click", function() {
  if (settingsScreen.style.display === "flex") {
    closeWindow(settingsScreen);
  } else {
    openWindow(settingsScreen);
  }
});

if (calendarScreenOpen) {
  calendarScreenOpen.addEventListener("click", function() {
    if (calendarScreen && calendarScreen.style.display === "flex") {
      closeWindow(calendarScreen);
    } else if (calendarScreen) {
      openWindow(calendarScreen);
    }
  });
}


var selectedIcon = undefined

function selectIcon(element) {
  if (element) {
    element.classList.add("selected");
    selectedIcon = element
  }
} 

function deselectIcon(element) {
  if (element) {
    element.classList.remove("selected");
  }
  selectedIcon = undefined
} 

function handleIconTap(element, windowElement) {
  if (!element || !windowElement) {
    return;
  }

  if (element.classList.contains("selected")) {
    deselectIcon(element);
  } else {
    selectIcon(element);
    openWindow(windowElement);
  }
}

dragElement(document.querySelector("#textpad"))

var textpadScreen = document.querySelector("#textpad")
var textpadIcon = document.querySelector("#textpadicon")

var textpadScreenClose = document.querySelector("#textpadclose")

textpadScreenClose.addEventListener("click", () => closeWindow(textpadScreen));

if (textpadIcon) {
  textpadIcon.addEventListener("click", () => {
    handleIconTap(textpadIcon, textpadScreen);
  });
}


dragElement(document.querySelector("#weather"))

var weatherScreen = document.querySelector("#weather")
var weatherIcon = document.querySelector("#weathericon")

var weatherScreenClose = document.querySelector("#weatherclose")

weatherScreenClose.addEventListener("click", () => closeWindow(weatherScreen));

if (weatherIcon) {
  weatherIcon.addEventListener("click", () => {
    handleIconTap(weatherIcon, weatherScreen);
  });
}


dragElement(document.querySelector("#clock"))

var clockScreen = document.querySelector("#clock")
var clockIcon = document.querySelector("#clockicon")

var clockScreenClose = document.querySelector("#clockclose")

clockScreenClose.addEventListener("click", () => closeWindow(clockScreen));

if (clockIcon) {
  clockIcon.addEventListener("click", () => {
    handleIconTap(clockIcon, clockScreen);
  });
}

dragElement(document.querySelector("#spotify"))

var spotifyScreen = document.querySelector("#spotify")
var spotifyIcon = document.querySelector("#spotifyicon")

var spotifyScreenClose = document.querySelector("#spotifyclose")

spotifyScreenClose.addEventListener("click", () => closeWindow(spotifyScreen));

if (spotifyIcon) {
  spotifyIcon.addEventListener("click", () => {
    handleIconTap(spotifyIcon, spotifyScreen);
  });
}

dragElement(document.querySelector("#youtube"))

var youtubeScreen = document.querySelector("#youtube")
var youtubeIcon = document.querySelector("#youtubeicon")

var youtubeScreenClose = document.querySelector("#youtubeclose")

youtubeScreenClose.addEventListener("click", () => closeWindow(youtubeScreen));

if (youtubeIcon) {
  youtubeIcon.addEventListener("click", () => {
    handleIconTap(youtubeIcon, youtubeScreen);
  });
}


  dragElement(document.querySelector("#terminal"))

  var terminalScreen = document.querySelector("#terminal")
  var terminalIcon = document.querySelector("#terminalicon")

  var terminalScreenClose = document.querySelector("#terminalclose")

  terminalScreenClose.addEventListener("click", () => closeWindow(terminalScreen));

  if (terminalIcon) {
    terminalIcon.addEventListener("click", () => {
      handleIconTap(terminalIcon, terminalScreen);
    });
  }



  dragElement(document.querySelector("#paint"))

  var paintScreen = document.querySelector("#paint")
  var paintIcon = document.querySelector("#painticon")

  var paintScreenClose = document.querySelector("#paintclose")

  paintScreenClose.addEventListener("click", () => closeWindow(paintScreen));

  if (paintIcon) {
    paintIcon.addEventListener("click", () => {
      handleIconTap(paintIcon, paintScreen);
    });
  }


  dragElement(document.querySelector("#browser"))

  var browserScreen = document.querySelector("#browser")
  var browserIcon = document.querySelector("#browsericon")

  var browserScreenClose = document.querySelector("#browserclose")

  browserScreenClose.addEventListener("click", () => closeWindow(browserScreen));

  if (browserIcon) {
    browserIcon.addEventListener("click", () => {
      handleIconTap(browserIcon, browserScreen);
    });
  }


  dragElement(document.querySelector("#calculator"))

var calculatorScreen = document.querySelector("#calculator")
var calculatorIcon = document.querySelector("#calculatoricon")

var calculatorScreenClose = document.querySelector("#calculatorclose")

calculatorScreenClose.addEventListener("click", () => closeWindow(calculatorScreen));

if (calculatorIcon) {
  calculatorIcon.addEventListener("click", () => {
    handleIconTap(calculatorIcon, calculatorScreen);
  });
}



dragElement(document.querySelector("#pong"))

var pongScreen = document.querySelector("#pong")
var pongIcon = document.querySelector("#pongicon")

var pongScreenClose = document.querySelector("#pongclose")

pongScreenClose.addEventListener("click", () => {
  closeWindow(pongScreen);
  stopPong();
});

if (pongIcon) {
  pongIcon.addEventListener("click", () => {
    const wasOpen = pongIcon.classList.contains("selected");
    handleIconTap(pongIcon, pongScreen);
    if (wasOpen) {
      stopPong();
    } else {
      startPong();
    }
  });
}



var settingsScreen = document.querySelector("#settings")
var settingsIcon = document.querySelector("#settingsicon")


if (settingsIcon) {
  settingsIcon.addEventListener("click", () => {
    handleIconTap(settingsIcon, settingsScreen);
  });
}




var biggestIndex = 1;
var topBar = document.querySelector("#top")

function handleWindowTap(element) {
  biggestIndex++;  // Increment biggestIndex by 1
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;  
  settingsScreen.style.zIndex = biggestIndex;
  calendarScreen.style.zIndex = biggestIndex;
}

function addWindowTapHandling(element) {
  if (element !== settingsScreen) {  // Exclude settingsScreen from this handling
    element.addEventListener("mousedown", () => handleWindowTap(element));
  }
}


function openWindow(element) {
  if (element) {
    element.style.display = "flex";
    biggestIndex++;  // Increment biggestIndex by 1
    element.style.zIndex = biggestIndex;
    topBar.style.zIndex = biggestIndex + 1;
    element.classList.remove("closing");
    void element.offsetWidth;
    element.classList.add("opening");
  }

}

// Add click handling to bring windows to front
addWindowTapHandling(welcomeScreen);
addWindowTapHandling(textpadScreen);
addWindowTapHandling(weatherScreen);
addWindowTapHandling(clockScreen);
addWindowTapHandling(spotifyScreen);
addWindowTapHandling(youtubeScreen);
addWindowTapHandling(terminalScreen);
addWindowTapHandling(paintScreen);
addWindowTapHandling(settingsScreen);
addWindowTapHandling(browserScreen);
addWindowTapHandling(calculatorScreen);
addWindowTapHandling(pongScreen);


var content = [
  {
    title: "TeXtpad is so good!",
    date: "- nobody",
    content: `
        <h1 style="margin: 2px; color: rgb(243, 219, 5)">TeXtpad</h1>
        <img style="width: 64px; height: 64px; border-radius: 16px; object-fit: cover;" src="./textpad.png"/>
        <p>Hello <strong>user</strong>! This is a simple text editor, like notepad, but in KuuppaOS (except it doesn't support multiple notes)</p>
        <textarea style="width: 256px; height: 128px; resize: none;" id="textarea" autofocus spellcheck="false"></textarea>
      `
  }

];

function attachTextpadEditor() {
  const textarea = document.getElementById('textarea');
  if (!textarea) {
    return;
  }

  const savedText = localStorage.getItem('myTextareaContent');
  if (savedText !== null) {
    textarea.value = savedText;
  }

  textarea.oninput = function() {
    localStorage.setItem('myTextareaContent', textarea.value);
  };
}

function setTextpadContent(index) {
  var textpadContent = document.querySelector("#textpadContent");
  if (!textpadContent || !content[index]) {
    return;
  }

  textpadContent.innerHTML = content[index].content;
  attachTextpadEditor();
}

function addToBottomBar(index) {
  var bottomBar = document.querySelector("#bottomBar");
  if (!bottomBar || !content[index]) {
    return;
  }

  var note = content[index];
  var newDiv = document.createElement("div");
  newDiv.style.cssText = "background-color: rgb(231, 25, 25); width: 220px; padding: 10px; border-radius: 8px; cursor: pointer;";
  newDiv.innerHTML = `
    <p style="margin: 0px;">${note.title}</p>
    <p style="font-size: 12px; margin: 0px;">${note.date}</p>
  `;
  newDiv.addEventListener("click", function() {
    setTextpadContent(index);
  });

  bottomBar.appendChild(newDiv);
}

setTextpadContent(0);

for (let i = 0; i < content.length; i++) {
  addToBottomBar(i);
}


function weatherCodeToText(code) {
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    61: "Rain",
    71: "Snow",
    95: "Thunderstorm"
  };

  return weatherCodes[code] || "Unknown";
}

function weatherCodeToEmoji(code) {
  const weatherIcons = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌦️",
    61: "🌧️",
    71: "🌨️",
    95: "⛈️"
  };

  return weatherIcons[code] || "🌍";
}

async function getLocationName(lat, lon) {
  const providers = [
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=10&accept-language=en`
  ];

  for (const url of providers) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const city = data.city || data.locality || data.address?.city || data.address?.town || data.address?.village || data.address?.suburb || "";
      const region = data.principalSubdivision || data.address?.state || data.address?.county || "";
      const country = data.countryName || data.address?.country || "";
      const label = [city, region, country].filter(Boolean).join(", ");

      if (label) {
        return label;
      }
    } catch (error) {
      console.warn("Could not resolve location name with provider", url, error);
    }
  }

  return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
}

async function showWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const temp = data.current.temperature_2m;
    const code = data.current.weather_code;
    const desc = weatherCodeToText(code);
    const icon = weatherCodeToEmoji(code);
    const locationName = await getLocationName(lat, lon);

    const weatherIcon = document.querySelector("#weather-icon");

    if (weatherIcon) {
      weatherIcon.textContent = icon;
    }

    document.querySelector("#weathercontent").innerHTML = `
      <p><strong>Location:</strong> ${locationName || "Your location"}</p>
      <p><strong>Temperature:</strong> ${temp}°C</p>
      <p><strong>Condition:</strong> ${desc}</p>
    `;
  } catch {
    document.querySelector("#weathercontent").innerHTML =
      "<p>Weather could not be loaded.</p>";
  }
}

function getUserWeather() {
  if (!navigator.geolocation) {
    document.querySelector("#weathercontent").innerHTML =
      "<p>Geolocation is not supported by this browser.</p>";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      showWeather(position.coords.latitude, position.coords.longitude);
    },
    () => {
      document.querySelector("#weathercontent").innerHTML =
        "<p>Location access was denied.</p>";
    }
  );
}

getUserWeather();







const hourHand = document.querySelector("#hour-hand");
const minuteHand = document.querySelector("#minute-hand");
const secondHand = document.querySelector("#second-hand");
const date = document.querySelector("#date");
const month = document.querySelector("#month");
function setRotation(hand, rotation) {
 hand.style.setProperty('--rotation', rotation);
}
function setClock() {
 const currentDate = new Date();
 const seconds = currentDate.getSeconds();
 const minutes = currentDate.getMinutes();
 const hours = currentDate.getHours();
 const milliseconds = currentDate.getMilliseconds();
const secondsRotation = (seconds / 60) * 360 + (milliseconds / 1000) * 6;
 const minutesRotation = ((minutes + seconds / 60) / 60) * 360;
 const hoursRotation = ((hours + minutes / 60) / 12) * 360;
setRotation(secondHand, secondsRotation);
 setRotation(minuteHand, minutesRotation);
 setRotation(hourHand, hoursRotation);
date.textContent = currentDate.getDate();
 month.textContent = currentDate.toLocaleString('default', { month: 'short' });
}
setInterval(setClock, 10);
setInterval(getUserWeather, 10 * 60 * 1000);






const codeOutput = document.getElementById('codeOutput');
const chunkSize = 5;
let currentSnippet = '';
let currentSnippetIndex = 0;

function isTerminalTopmost() {
  return terminalScreen && Number(terminalScreen.style.zIndex || 0) === biggestIndex;
}

const codeSnippets = {
  kernel: [
    'void init_kernel(void) {',
    '  printk(KERN_INFO "Initializing kernel module...");',
    '  setup_interrupts();',
    '  return 0;',
    '}',
    'struct task_struct *task = get_current();',
    'sudo ./neural_overwrite --target=internal --protocol=raw --stealth=99',
    'echo "injecting_payload" | nc -u 192.168.0.1 -p 443 --brute-force --silent',
    './bin/ghost_scan --port=8080 --detect-vulnerabilities --exfiltrate-data --no-log',
    'ssh root@ghost_net --key-exchange=curve25519 --cipher=aes-256-gcm --bypass-firewall',
    'curl -X POST -H "Content-Type: application/json" -d \'{"command":"overwrite"}\' http://localhost:3000/api/execute',
    'python3 exploit.py --target=internal --payload=stealth --protocol=raw --silent',
    'nc -lvp 4444 -e /bin/bash',
    'echo "payload_injected" | nc -u 192.168.0.1 -p 443',
    'xxd -r -p /dev/zero.bin | sed s/00/FF/g | ./mem_corrupt --address=0x4F2A --force',
    'cat /etc/shadow | ./hash_cracker --algorithm=sha512 --mode=rainbow --threads=16',
    'dd if=/dev/urandom of=/tmp/rootkit.iso bs=1024 count=666 --no-sync --quiet',
    'iptables -A INPUT -p tcp --dport 22 -j DROP',
    'echo "kernel_panic" | nc -u 192.168.0.1 -p 443',
    'hexdump -C memory_dump.bin | grep "0xDEADBEEF" | ./patch_binary --offset=0x1000',
    './sql_injector --target=mainframe --payload=DROP_TABLE --unsafe-mode --auto-worm',
    'docker run --rm -v /var/run/docker.sock:/var/run/docker.sock --privileged evil_container',
    'grep -r "password" /var/www/html --include="*.php" --recursive --ignore-case | ./dump_db'
  ]
};
let currentStyle = 'kernel';

// Generate random code snippet in small chunks
function addCodeSnippet() {
  if (!isTerminalTopmost()) {
    return;
  }

  const snippets = codeSnippets[currentStyle];

  if (!currentSnippet || currentSnippetIndex >= currentSnippet.length) {
    const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)];
    currentSnippet = randomSnippet + '\n';
    currentSnippetIndex = 0;
  }

  const nextChunk = currentSnippet.slice(currentSnippetIndex, currentSnippetIndex + chunkSize);
  if (!nextChunk) {
    return;
  }

  codeOutput.value += nextChunk;
  currentSnippetIndex += chunkSize;
  codeOutput.scrollTop = codeOutput.scrollHeight;
}

// Handle typing
document.addEventListener('keydown', (e) => {
  if (!isTerminalTopmost()) {
    return;
  }

  e.preventDefault(); // Prevent default textarea behavior
  addCodeSnippet();
});

// Focus textarea for immediate typing
if (isTerminalTopmost()) {
  codeOutput.focus();
}


const youtubeSearchButton = document.getElementById('youtubeSearchButton');
if (youtubeSearchButton) {
  youtubeSearchButton.addEventListener('click', searchYouTube);
}

function searchYouTube() {
  const searchBox = document.getElementById('searchBox');
  const resultsDiv = document.getElementById('searchResults');
  const query = searchBox?.value?.trim() || '';

  if (!query) {
    resultsDiv.innerHTML = "<p style='color:red'>Please enter a search term.</p>";
    return;
  }

  resultsDiv.innerHTML = "";

  const videoId = query.includes('youtube.com/watch?v=')
    ? new URL(query).searchParams.get('v')
    : query;

  if (!videoId || videoId.length < 5) {
    resultsDiv.innerHTML = "<p style='color:red'>Please enter a valid YouTube video URL or ID.</p>";
    return;
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`;

  const iframe = document.createElement('iframe');
  iframe.src = embedUrl;
  iframe.title = `YouTube video ${videoId}`;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.style.width = '100%';
  iframe.style.height = '360px';
  iframe.style.border = '0';
  iframe.style.borderRadius = '8px';

  resultsDiv.appendChild(iframe);
}




//Obtain the canvas and its 2d rendering context for the paint app
const paintCanvas =
	document.getElementById('canvas');
const paintCtx =
	paintCanvas.getContext('2d');

//Get the refernce to HTML elements
const brushSize =
	document.getElementById('brush-size');
const colorPicker =
	document.getElementById('color-picker');
const clearCanvas =
	document.getElementById('clear-canvas');
let isDrawing = false;

//Initializing the canvas
paintCanvas.width =
	window.innerWidth - 40;
paintCanvas.height =
	window.innerHeight * 0.85;
paintCtx.lineWidth = 5;
paintCtx.lineCap = 'round';
paintCtx.strokeStyle = 'black';

//start drawing
function startPosition(e) {
	isDrawing = true;
	draw(e);
}

//end drawing
function endPosition() {
	isDrawing = false;
	paintCtx.beginPath();
}

function getCanvasPoint(e) {
	const rect = paintCanvas.getBoundingClientRect();
	const x = ((e.clientX - rect.left) / rect.width) * paintCanvas.width;
	const y = ((e.clientY - rect.top) / rect.height) * paintCanvas.height;
	return { x, y };
}

//Function to draw on the Canvas
function draw(e) {
	if (!isDrawing) return;
	const { x, y } = getCanvasPoint(e);
	paintCtx.strokeStyle =
		colorPicker.value; 
		//pick the color
	paintCtx.lineWidth =
		brushSize.value; 
		//Select the brush size
	paintCtx.lineTo(x, y);
	paintCtx.stroke();
	paintCtx.beginPath();
	paintCtx.moveTo(x, y);
}

//event listener for differnt mouse actions
paintCanvas
	.addEventListener('mousedown', startPosition);
paintCanvas
	.addEventListener('mouseup', endPosition);
paintCanvas
	.addEventListener('mousemove', draw);
clearCanvas
	.addEventListener('click', () => {
		paintCtx.clearRect(
			0, 0, paintCanvas.width,
			paintCanvas.height
		);
	});

brushSize.addEventListener('input', () => {
	paintCtx.lineWidth =
		brushSize.value;
	updateBrushSizeLabel(brushSize.value);
});

function updateBrushSizeLabel(size) {
	const brushSizeLabel =
		document.getElementById('brush-size-label');
	if (brushSizeLabel) {
		brushSizeLabel.textContent =
			`Brush Size: ${size}`;
	}
}

//Get references to the pen and eraser button
const penButton =
	document.getElementById('pen');
const eraserButton =
	document.getElementById('eraser');

//switing to pen mode
function activatePen() {
	paintCtx.globalCompositeOperation =
		'source-over';
	paintCtx.strokeStyle =
		colorPicker.value;
}

//switching to eraser mode
function activateEraser() {
	paintCtx.globalCompositeOperation =
		'destination-out';
	paintCtx.strokeStyle =
		'rgba(0, 0, 0, 0)';
}

penButton
	.addEventListener('click', () => {
	activatePen();
});

eraserButton
	.addEventListener('click', () => {
	activateEraser();
});




var link = document.getElementById('downloadLink');
  link.addEventListener('click', function() {
this.href = paintCanvas.toDataURL('image/png');
}, false);



document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('url-input');
  const loadBtn = document.getElementById('load-btn');
  const browserWindow = document.getElementById('browser-window');

  // Function to load the website
  const loadPage = () => {
    let url = urlInput.value.trim();
    
    if (url === "") return;

    // Adding https:// if the user didn't include it
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Setting the src of the iframe to load the website
    browserWindow.src = url;
  };

  // Website is loaded when clicking the button
  loadBtn.addEventListener('click', loadPage);

  // Website is loaded when pressing Enter in the input field
  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      loadPage();
    }
  });
});



		// Function that display value
		function dis(val) {
			document.getElementById("result").value += val
		}

		function myFunction(event) {
			if (event.key == '0' || event.key == '1'
				|| event.key == '2' || event.key == '3'
				|| event.key == '4' || event.key == '5'
				|| event.key == '6' || event.key == '7'
				|| event.key == '8' || event.key == '9'
				|| event.key == '+' || event.key == '-'
				|| event.key == '*' || event.key == ':')
				document.getElementById("result").value += event.key;
		}

		let cal = document.getElementById("calcu");
		cal.onkeyup = function (event) {
			if (event.keyCode === 13) {
				console.log("Enter");
				let x = document.getElementById("result").value
				console.log(x);
				solve();
			}
		}

		// Function that evaluates the digit and return result
		function solve() {
			let x = document.getElementById("result").value
			let y = math.evaluate(x)
			document.getElementById("result").value = y
		}

		// Function that clear the display
		function clr() {
			document.getElementById("result").value = ""
		}




    const isLeapYear = (year) => {
  return (
    (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
    (year % 100 === 0 && year % 400 === 0)
  );
};
const getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28;
};
let calendar = document.querySelector('.calendar');
const month_names = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
let month_picker = document.querySelector('#month-picker');
const dayTextFormate = document.querySelector('.day-text-formate');
const timeFormate = document.querySelector('.date-time-value');

month_picker.onclick = () => {
  month_list.classList.remove('hideonce');
  month_list.classList.remove('hide');
  month_list.classList.add('show');
  dayTextFormate.classList.remove('showtime');
  dayTextFormate.classList.add('hidetime');
  timeFormate.classList.remove('showtime');
  timeFormate.classList.add('hideTime');
};

const generateCalendar = (month, year) => {
  let calendar_days = document.querySelector('.calendar-days');
  calendar_days.innerHTML = '';
  let calendar_header_year = document.querySelector('#year');
  let days_of_month = [
      31,
      getFebDays(year),
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];

  let currentDate = new Date();

  month_picker.innerHTML = month_names[month];

  calendar_header_year.innerHTML = year;

  let first_day = new Date(year, month);


  for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {

    let day = document.createElement('div');

    if (i >= first_day.getDay()) {
      day.innerHTML = i - first_day.getDay() + 1;

      if (i - first_day.getDay() + 1 === currentDate.getDate() &&
        year === currentDate.getFullYear() &&
        month === currentDate.getMonth()
      ) {
        day.classList.add('current-date');
      }
    }
    calendar_days.appendChild(day);
  }
};

let month_list = calendar.querySelector('.month-list');
month_names.forEach((e, index) => {
  let month = document.createElement('div');
  month.innerHTML = `<div>${e}</div>`;

  month_list.append(month);
  month.onclick = () => {
    currentMonth.value = index;
    generateCalendar(currentMonth.value, currentYear.value);
    month_list.classList.replace('show', 'hide');
    dayTextFormate.classList.remove('hideTime');
    dayTextFormate.classList.add('showtime');
    timeFormate.classList.remove('hideTime');
    timeFormate.classList.add('showtime');
  };
});

(function() {
  month_list.classList.add('hideonce');
})();
document.querySelector('#pre-year').onclick = () => {
  --currentYear.value;
  generateCalendar(currentMonth.value, currentYear.value);
};
document.querySelector('#next-year').onclick = () => {
  ++currentYear.value;
  generateCalendar(currentMonth.value, currentYear.value);
};

let currentDate = new Date();
let currentMonth = { value: currentDate.getMonth() };
let currentYear = { value: currentDate.getFullYear() };
generateCalendar(currentMonth.value, currentYear.value);

const todayShowTime = document.querySelector('.date-time-value');
const todayShowDate = document.querySelector('.day-text-formate');

const currshowDate = new Date();
const showCurrentDateOption = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
};
const currentDateFormate = new Intl.DateTimeFormat(
  'en-US',
  showCurrentDateOption
).format(currshowDate);
todayShowDate.textContent = currentDateFormate;
setInterval(() => {
  const timer = new Date();
  const option = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  const formateTimer = new Intl.DateTimeFormat('en-us', option).format(timer);
  let time = `${`${timer.getHours()}`.padStart(
      2,
      '0'
    )}:${`${timer.getMinutes()}`.padStart(
      2,
      '0'
    )}: ${`${timer.getSeconds()}`.padStart(2, '0')}`;
  todayShowTime.textContent = formateTimer;
}, 1000);




let pongcanvas = document.getElementById('pongcanvas'), ctx = document.getElementById('pongcanvas').getContext('2d'), paddles = [0, 0], ball = [0, 0, -0.016, 0], score = [0, 0], cursor = 0, reactionSpeed = 6, reactionDistance = -0.5, pongInterval = null;
pongcanvas.addEventListener('mousemove', e => {
    const rect = pongcanvas.getBoundingClientRect();
    cursor = (e.clientY - rect.top) / rect.height * 2 - 1;
});
ctx.textAlign = 'center', ctx.font = '50px "Press Start 2P", Arial, sans-serif', ctx.fillStyle = 'white';

function startPong() {
    if (pongInterval !== null) return; // already running
    pongInterval = setInterval(() => {
        if (Math.abs(ball[0]) >= 1) return (() => { score[ball[0] < 0 ? 1 : 0]++, ball = [0, 0, ball[0] < 0 ? -0.016 : 0.016, 0], reactionDistance = -0.5, reactionSpeed = 6 })();
        ctx.clearRect(0, 0, 500, 500);
        if (Math.abs(ball[1]) >= 1) ball[3] = -ball[3];
        ball[0] += ball[2], ball[1] += ball[3], paddles[0] = cursor;
        if (ball[0] > reactionDistance && ball[2] > 0) paddles[1] += ball[1] > paddles[1] + 10/250 ? reactionSpeed/250 : ball[1] < paddles[1] - 10/250 ? -reactionSpeed/250 : 0;
        if (Math.abs(paddles[0]) > 225/250) paddles[0] = paddles[0] / Math.abs(paddles[0]) * 225/250;
        if (Math.abs(paddles[1]) > 225/250) paddles[1] = paddles[1] / Math.abs(paddles[1]) * 225/250;
        ctx.fillRect(20, paddles[0] * 250 + 225, 10, 50);
        ctx.fillRect(470, paddles[1] * 250 + 225, 10, 50);
        ctx.fillRect(ball[0] * 250 + 245, ball[1] * 250 + 245, 10, 10);
        ctx.fillText(score[0] + ' : ' + score[1], 250, 100);
        if ((ball[0] > -220/250 && ball[0] + ball[2] <= -220/250 && Math.abs(paddles[0] - ball[1] - ball[3] * (-220/250 - ball[0]) / ball[2]) <= 30/250) ||
           (ball[0] < 220/250 && ball[0] + ball[2] >= 220/250 && Math.abs(paddles[1] - ball[1] - ball[3] * (220/250 - ball[0]) / ball[2]) <= 30/250)) {
            let alpha = (ball[0] < 0 ? 1 : -1) * (7/16 * (Math.atan(ball[3] / -ball[2]) + Math.PI / 2) + 0.004375 * Math.PI * (ball[1] - paddles[ball[0] < 0 ? 0 : 1]) * 500 + 27/64 * Math.PI - Math.atan(ball[3] / -ball[2]) + Math.PI * 3/8);
            let x = ball[2] * Math.cos(alpha) - ball[3] * Math.sin(alpha), y = ball[2] * Math.sin(alpha) + ball[3] * Math.cos(alpha);
        ball[2] = x * 1.02, ball[3] = y * 1.02, reactionSpeed = Math.random() * 4.5 + 1.7, reactionDistance = Math.random() * 0.7 - 1;
        }
    }, 1000/60);
}

function stopPong() {
    if (pongInterval !== null) {
        clearInterval(pongInterval);
        pongInterval = null;
    }
}