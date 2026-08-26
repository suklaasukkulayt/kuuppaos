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

dragElement(document.getElementById("welcome"));

function dragElement(element) {
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  if (document.getElementById(element.id + "header")) {
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }

  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();
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

    element.style.top = Math.max(minTop, Math.min(nextTop, maxTop)) + "px";
    element.style.left = Math.max(minLeft, Math.min(nextLeft, maxLeft)) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  if (window.ResizeObserver) {

    var isFirstResizeObservation = true;
    var resizeObserver = new ResizeObserver(function (windowId) {
      if (isFirstResizeObservation) {
        isFirstResizeObservation = false;
        return;
      }
      if (element.style.display === "none") return;
      if (element.id === "youtube") {
        resizeYouTubePlayer();
      }

      var minTop = element.offsetHeight / 2;
      var minTop = element.offsetHeight / 2;
      var minLeft = element.offsetWidth / 2;
      var maxTop = window.innerHeight - element.offsetHeight / 2;
      var maxLeft = window.innerWidth - element.offsetWidth / 2;
      element.style.top = Math.max(minTop, Math.min(element.offsetTop, maxTop)) + "px";
      element.style.left = Math.max(minLeft, Math.min(element.offsetLeft, maxLeft)) + "px";
    });
    resizeObserver.observe(element);
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
        removeTaskbarApp(element);
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

function handleIconTap(element, windowElement, appName) {
  if (!element || !windowElement) {
    return;
  }

  if (element.classList.contains("selected")) {
    deselectIcon(element);
  } else {
    selectIcon(element);
    openWindow(windowElement, appName);
  }
}

dragElement(document.querySelector("#textpad"))

var textpadScreen = document.querySelector("#textpad")
var textpadIcon = document.querySelector("#textpadicon")

var textpadScreenClose = document.querySelector("#textpadclose")

textpadScreenClose.addEventListener("click", () => closeWindow(textpadScreen));

if (textpadIcon) {
  textpadIcon.addEventListener("click", () => {
    handleIconTap(textpadIcon, textpadScreen, "TeXtpad");
  });
}


dragElement(document.querySelector("#weather"))

var weatherScreen = document.querySelector("#weather")
var weatherIcon = document.querySelector("#weathericon")

var weatherScreenClose = document.querySelector("#weatherclose")

weatherScreenClose.addEventListener("click", () => closeWindow(weatherScreen));

if (weatherIcon) {
  weatherIcon.addEventListener("click", () => {
    handleIconTap(weatherIcon, weatherScreen, "Weather");
  });
}


dragElement(document.querySelector("#clock"))

var clockScreen = document.querySelector("#clock")
var clockIcon = document.querySelector("#clockicon")

var clockScreenClose = document.querySelector("#clockclose")

clockScreenClose.addEventListener("click", () => closeWindow(clockScreen));

if (clockIcon) {
  clockIcon.addEventListener("click", () => {
    handleIconTap(clockIcon, clockScreen, "Clock");
  });
}

dragElement(document.querySelector("#spotify"))

var spotifyScreen = document.querySelector("#spotify") 
var spotifyIcon = document.querySelector("#spotifyicon")
var spotifyScreenClose = document.querySelector("#spotifyclose")

spotifyScreenClose.addEventListener("click", () => {
  closeWindow(spotifyScreen);
  audio.pause();
  audio.src = '';
  playBtn.classList.remove("pause");
  playBtn.classList.add("play");
  radioimg.src = "./icons/radio.png"
});

if (spotifyIcon) {
  spotifyIcon.addEventListener("click", () => {
    handleIconTap(spotifyIcon, spotifyScreen, "KuuppaMusic");
  });
}

dragElement(document.querySelector("#youtube"))

var youtubeScreen = document.querySelector("#youtube")
var youtubeIcon = document.querySelector("#youtubeicon")
var youtubeScreenClose = document.querySelector("#youtubeclose")

youtubeScreenClose.addEventListener("click", () => {
  closeWindow(youtubeScreen);
  if (player && typeof player.stopVideo === "function") {
    player.stopVideo();
  }
});

if (youtubeIcon) {
  youtubeIcon.addEventListener("click", () => {
    handleIconTap(youtubeIcon, youtubeScreen, "KuuppaVid");
  });
}


  dragElement(document.querySelector("#cterminal"))

  var cterminalScreen = document.querySelector("#cterminal")
  var cterminalIcon = document.querySelector("#cterminalicon")

  var cterminalScreenClose = document.querySelector("#cterminalclose")

  cterminalScreenClose.addEventListener("click", () => closeWindow(cterminalScreen));

  if (cterminalIcon) {
    cterminalIcon.addEventListener("click", () => {
      handleIconTap(cterminalIcon, cterminalScreen, "HackCMD");
    });
  }

  dragElement(document.querySelector("#terminal"))

  var terminalScreen = document.querySelector("#terminal")
  var terminalIcon = document.querySelector("#terminalicon")

  var terminalScreenClose = document.querySelector("#terminalclose")

  terminalScreenClose.addEventListener("click", () => closeWindow(terminalScreen));

  if (terminalIcon) {
    terminalIcon.addEventListener("click", () => {
      handleIconTap(terminalIcon, terminalScreen, "Terminal");
    });
  }



  dragElement(document.querySelector("#paint"))

  var paintScreen = document.querySelector("#paint")
  var paintIcon = document.querySelector("#painticon")

  var paintScreenClose = document.querySelector("#paintclose")

  paintScreenClose.addEventListener("click", () => closeWindow(paintScreen));

  if (paintIcon) {
    paintIcon.addEventListener("click", () => {
      handleIconTap(paintIcon, paintScreen, "Paint");
    });
  }


  dragElement(document.querySelector("#browser"))

  var browserScreen = document.querySelector("#browser")
  var browserIcon = document.querySelector("#browsericon")

  var browserScreenClose = document.querySelector("#browserclose")

  browserScreenClose.addEventListener("click", () => closeWindow(browserScreen));

  if (browserIcon) {
    browserIcon.addEventListener("click", () => {
      handleIconTap(browserIcon, browserScreen, "KuuppaBrowser");
    });
  }


  dragElement(document.querySelector("#calculator"))

var calculatorScreen = document.querySelector("#calculator")
var calculatorIcon = document.querySelector("#calculatoricon")

var calculatorScreenClose = document.querySelector("#calculatorclose")

calculatorScreenClose.addEventListener("click", () => closeWindow(calculatorScreen));

if (calculatorIcon) {
  calculatorIcon.addEventListener("click", () => {
    handleIconTap(calculatorIcon, calculatorScreen, "Calculator");
  });
}

dragElement(document.querySelector("#info"))

var infoScreen = document.querySelector("#info")
var infoIcon = document.querySelector("#infoicon")

var infoScreenClose = document.querySelector("#infoclose")

infoScreenClose.addEventListener("click", () => closeWindow(infoScreen));

if (infoIcon) {
  infoIcon.addEventListener("click", () => {
    handleIconTap(infoIcon, infoScreen, "Info");
  });
}

  dragElement(document.querySelector("#ghost"))

var ghostScreen = document.querySelector("#ghost")
var ghostIcon = document.querySelector("#ghosticon")
const ghostWindow = document.getElementById('ghostG');
var ghostScreenClose = document.querySelector("#ghostclose")

ghostScreenClose.addEventListener("click", () => {
  closeWindow(ghostScreen);
  ghostWindow.src = 'about:blank';
});
  

if (ghostIcon) {
  ghostIcon.addEventListener("click", () => {
    ghostWindow.src = 'https://suklaasukkulayt.github.io/ghost-game/';
    handleIconTap(ghostIcon, ghostScreen, "Ghost game");
  });
}

dragElement(document.querySelector("#camera"))

var cameraScreen = document.querySelector("#camera")
var cameraIcon = document.querySelector("#cameraicon")

var cameraScreenClose = document.querySelector("#cameraclose")

cameraScreenClose.addEventListener("click", () => {
  closeWindow(cameraScreen);
  stopCamera();
});

if (cameraIcon) {
  cameraIcon.addEventListener("click", () => {
    handleIconTap(cameraIcon, cameraScreen, "Camera");
  });
}



dragElement(document.querySelector("#pong"))

var pongScreen = document.querySelector("#pong")
var pongIcon = document.querySelector("#pongicon")

var pongScreenClose = document.querySelector("#pongclose")
var pongScreenMinimize = document.querySelector("#pongminimize")

pongScreenClose.addEventListener("click", () => {
  closeWindow(pongScreen);
  stopPong();
  resetPong();
});

if (pongIcon) {
  pongIcon.addEventListener("click", () => {
    const wasOpen = pongIcon.classList.contains("selected");
    handleIconTap(pongIcon, pongScreen, "Pong");
    if (wasOpen) {
      
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
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;  
  settingsScreen.style.zIndex = biggestIndex;
  calendarScreen.style.zIndex = biggestIndex;
}

function addWindowTapHandling(element) {
  if (element !== settingsScreen) {
    element.addEventListener("mousedown", () => handleWindowTap(element));
  }
}




addWindowTapHandling(welcomeScreen);
addWindowTapHandling(textpadScreen);
addWindowTapHandling(weatherScreen);
addWindowTapHandling(clockScreen);
addWindowTapHandling(spotifyScreen);
addWindowTapHandling(youtubeScreen);
addWindowTapHandling(cterminalScreen);
addWindowTapHandling(terminalScreen);
addWindowTapHandling(paintScreen);
addWindowTapHandling(settingsScreen);
addWindowTapHandling(browserScreen);
addWindowTapHandling(calculatorScreen);
addWindowTapHandling(pongScreen);
addWindowTapHandling(cameraScreen);
addWindowTapHandling(ghostScreen);
addWindowTapHandling(infoScreen);


var content = [
  {
    title: "TeXtpad is so good!",
    date: "- nobody",
    content: `
        <h1 class="ubuntu-regular" style="margin: 2px; color: rgb(243, 219, 5)">TeXtpad</h1>
        <textarea style="width: 256px; height: 128px; resize: auto;" id="textarea" autofocus spellcheck="true"></textarea>
        <p style="margin: 0px;">Note saves to your browser's local storage.</p>
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
  newDiv.style.cssText = "background-color: rgb(231, 25, 25); width: 220px; padding: 10px; border-radius: 8px;";
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
  return cterminalScreen && Number(cterminalScreen.style.zIndex || 0) === biggestIndex;
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

document.addEventListener('keydown', (e) => {
  if (!isTerminalTopmost()) {
    return;
  }

  e.preventDefault();
  addCodeSnippet();
});

if (isTerminalTopmost()) {
  codeOutput.focus();
}


const API_KEY = 'AIzaSyAHCbUf3EHTFg1L84i3Hu2T4L1tzz968n8';
let player = null;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '390',
        width: '640',
        videoId: '', 
        playerVars: {
            'playsinline': 1,
            'autoplay': 1
        },
        events: {
            'onReady': resizeYouTubePlayer
        }
    });
}

function resizeYouTubePlayer() {
    if (!player || typeof player.setSize !== "function") return;
    var container = document.getElementById("youtube-player");
    if (!container) return;
    var wrapper = container.parentElement;
    var width = wrapper.clientWidth;
    var height = Math.round(width * 9 / 16);
    player.setSize(width, height);
}

async function searchYouTube() {
    const query = document.getElementById('searchInput').value;
    if (!query) return;

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 'Searching...';

    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=${encodeURIComponent(query)}&type=video,playlist&key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        resultsDiv.innerHTML = '';

        if (!data.items || data.items.length === 0) {
            resultsDiv.innerHTML = 'No results.';
            return;
        }else{
          data.items.length = 5;
        }

        data.items.forEach(item => {
            const isPlaylist = item.id.kind === 'youtube#playlist';
            const id = isPlaylist ? item.id.playlistId : item.id.videoId;
            const title = item.snippet.title;
            const thumbnail = item.snippet.thumbnails.default.url;

            const div = document.createElement('div');
            div.className = 'result-item';
            
            const temp = document.createElement('div');
            temp.innerHTML = title;
            
            div.innerHTML = `
                <img src="${thumbnail}" alt="thumbnail">
                <div class="info">
                    <span class="badge ${isPlaylist ? 'playlist' : 'video'}">
                        ${isPlaylist ? 'Playlist' : 'Video'}
                    </span>
                    <span>${temp.innerText}</span>
                </div>
            `;
            
            div.onclick = () => {
                if (isPlaylist) {
                    player.loadPlaylist({list: id});
                } else {
                    player.loadVideoById(id);
                }
                document.getElementById('player-container').scrollIntoView({ behavior: 'smooth' });
            };

            resultsDiv.appendChild(div);
        });

    } catch (error) {
        console.error(error);
        resultsDiv.innerHTML = 'Error searching.';
    }
}




const paintCanvas =
	document.getElementById('pcanvas');
const paintCtx =
	paintCanvas.getContext('2d');

const brushSize =
	document.getElementById('brush-size');
const colorPicker =
	document.getElementById('color-picker');
const clearCanvas =
	document.getElementById('clear-canvas');
let isDrawing = false;

paintCanvas.width =
	window.innerWidth - 40;
paintCanvas.height =
	window.innerHeight * 0.85;
paintCtx.lineWidth = 5;
paintCtx.lineCap = 'round';
paintCtx.strokeStyle = 'black';

function startPosition(e) {
	isDrawing = true;
	draw(e);
}

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

function draw(e) {
	if (!isDrawing) return;
	const { x, y } = getCanvasPoint(e);
	paintCtx.strokeStyle =
		colorPicker.value; 
	paintCtx.lineWidth =
		brushSize.value; 
	paintCtx.lineTo(x, y);
	paintCtx.stroke();
	paintCtx.beginPath();
	paintCtx.moveTo(x, y);
}

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

const penButton =
	document.getElementById('pen');
const eraserButton =
	document.getElementById('eraser');

function activatePen() {
	paintCtx.globalCompositeOperation =
		'source-over';
	paintCtx.strokeStyle =
		colorPicker.value;
}

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

  const loadPage = () => {
    let url = urlInput.value.trim();
    
    if (url === "") return;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    browserWindow.src = url;
  };

  loadBtn.addEventListener('click', loadPage);

  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      loadPage();
    }
  });
});



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

		function solve() {
			let x = document.getElementById("result").value
			let y = math.evaluate(x)
			document.getElementById("result").value = y
		}

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
    if (pongInterval !== null) return;
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

function resetPong() {
    paddles = [0, 0];
    ball = [0, 0, -0.016, 0];
    score = [0, 0];
    cursor = 0;
    reactionSpeed = 6;
    reactionDistance = -0.5;
    ctx.clearRect(0, 0, 500, 500);
}


const API_URL = 'https://xfm.ee/wp-json/xfm/v1/nowplaying?';
const trackTitleEl = document.getElementById('track-title');
const trackminimize = document.getElementById('trackminimize');

async function fetchNowPlaying() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network error');
        
        const data = await response.json();
        const titleText = data.title || 'Unknown song';

        trackTitleEl.textContent = titleText + " - XFM";
        trackminimize.textContent = titleText;
      } catch (err) {
        console.error('Song search failed:', err);
      }
    }

    fetchNowPlaying();
    setInterval(fetchNowPlaying, 60000);

setupMinimize("#textpad", "#textpadminimize", "TeXtpad");
setupMinimize("#clock", "#clockminimize", "Clock");
setupMinimize("#weather", "#weatherminimize", "Weather");
setupMinimize("#spotify", "#spotifyminimize", "KuuppaMusic");
setupMinimize("#youtube", "#youtubeminimize", "KuuppaVid");
setupMinimize("#terminal", "#terminalminimize", "Terminal");
setupMinimize("#cterminal", "#cterminalminimize", "HackCMD");
setupMinimize("#paint", "#paintminimize", "Paint");
setupMinimize("#browser", "#browserminimize", "KuuppaBrowser");
setupMinimize("#calculator", "#calculatorminimize", "Calculator");
setupMinimize("#pong", "#pongminimize", "Pong");
setupMinimize("#camera", "#cameraminimize", "Camera");
setupMinimize("#ghost", "#ghostminimize", "Ghost game");
setupMinimize("#info", "#infominimize", "Info");
setupMinimize("#welcome", "#welcomeminimize", "Welcome");

function minimizeWindow(windowElement) {
    if (!windowElement) return;
    void windowElement.offsetWidth;
    windowElement.classList.add("closing");
    setTimeout(function () {
        windowElement.style.display = "none";
        windowElement.classList.remove("closing");
    }, 250);
}

function changeTrackMinimize(){
        trackt = trackminimize.textContent;
        removeTaskbarApp(spotifyScreen);
        addTaskbarApp(spotifyScreen, trackt);
}

var openApps = document.querySelector("#openApps");
function addTaskbarApp(windowElement, name) {
    if (windowElement.id === "settings") {
      return;
    } else if (windowElement.id === "calendar"){
      return;
    }

      else if(document.querySelector("#task-" + windowElement.id)) {
        return;
    }

    var button = document.createElement("button");

    button.id = "task-" + windowElement.id;
    button.className = "openApp";
    button.innerHTML = name;
    button.addEventListener("click", function () {
        if (windowElement.style.display === "none") {
            openWindow(windowElement);

            if(windowElement.id === "pong"){
              startPong();
            }

            handleWindowTap(windowElement);
        } else {
            minimizeWindow(windowElement);
            if(windowElement.id === "camera"){
              stopCamera();
            }
            if(windowElement.id === "spotify"){

          if(audio.paused === false){
          changeTrackMinimize();
          setInterval(changeTrackMinimize, 60000);
          }else{
            clearInterval(changeTrackMinimize);
          }

          }
        }
    });
    openApps.appendChild(button);
}


addTaskbarApp(welcomeScreen, "Welcome");

function removeTaskbarApp(windowElement) {
    var button = document.querySelector("#task-" + windowElement.id);
    if (button) {
        button.remove();
    }
}

function setupMinimize(windowId, buttonId, appName) {
    var windowElement = document.querySelector(windowId);
    var minimizeButton = document.querySelector(buttonId);

    minimizeButton.addEventListener("click", function () {
        minimizeWindow(windowElement);
        if(windowElement.id === "pong"){
              stopPong();
            }
        if(windowElement.id === "camera"){
              stopCamera();
            }
        if(windowElement.id === "spotify"){
          
          if(audio.paused === false){
          changeTrackMinimize();
          setInterval(changeTrackMinimize, 60000);
          }else{
            clearInterval(changeTrackMinimize);
          }
            }
    });
}

function openWindow(element, appName) {
  if (element) {
    element.style.display = "flex";
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    topBar.style.zIndex = biggestIndex + 1;
    element.classList.remove("closing");
    void element.offsetWidth;
    element.classList.add("opening");
    addTaskbarApp(element, appName);

    var minTop = element.offsetHeight / 2;
    var minLeft = element.offsetWidth / 2;
    var maxTop = window.innerHeight - element.offsetHeight / 2;
    var maxLeft = window.innerWidth - element.offsetWidth / 2;
    element.style.top = Math.max(minTop, Math.min(element.offsetTop, maxTop)) + "px";
    element.style.left = Math.max(minLeft, Math.min(element.offsetLeft, maxLeft)) + "px";

    if (element.id === "camera") {
      startCamera();
    }
    if (element.id === "spotify"){
      removeTaskbarApp(spotifyScreen);
      addTaskbarApp(spotifyScreen, "KuuppaMusic");
      clearInterval(changeTrackMinimize);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const desktop = document.getElementById("desktop");
  const selectionBox = document.getElementById("selection-box");

  let isSelecting = false;
  let startX = 0;
  let startY = 0;

  desktop.addEventListener("mousedown", (e) => {
    if (e.target !== desktop) return;

    const desktopRect = desktop.getBoundingClientRect();
    
    startX = e.clientX - desktopRect.left;
    startY = e.clientY - desktopRect.top;

    isSelecting = true;

    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    selectionBox.style.display = 'block';

    document.querySelectorAll(".desktop-icon").forEach(icon => {
      icon.classList.remove("selected");
    });
  });

  document.addEventListener("mousemove", (e) => {
    if (!isSelecting) return;

    const desktopRect = desktop.getBoundingClientRect();
    const currentX = Math.max(0, Math.min(e.clientX - desktopRect.left, desktopRect.width));
    const currentY = Math.max(0, Math.min(e.clientY - desktopRect.top, desktopRect.height));

    const left = Math.min(startX, currentX);
    const top = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    selectionBox.style.left = `${left}px`;
    selectionBox.style.top = `${top}px`;
    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;

    const boxRect = selectionBox.getBoundingClientRect();
    const icons = document.querySelectorAll(".desktop-icon");

    icons.forEach(icon => {
      const iconRect = icon.getBoundingClientRect();

      const isOverlapping = !(
        boxRect.right < iconRect.left ||
        boxRect.left > iconRect.right ||
        boxRect.bottom < iconRect.top ||
        boxRect.top > iconRect.bottom
      );

      if (isOverlapping) {
        icon.classList.add("selected");
      } else {
        icon.classList.remove("selected");
      }
    });
  });


  document.addEventListener("mouseup", () => {
    if (isSelecting) {
      isSelecting = false;
      selectionBox.style.display = 'none';
    }
  });
});




var cmdInput = document.querySelector("#cmdInput");
var cmdOutput = document.querySelector("#cmdOutput");
var cmdContent = cmdOutput.closest(".cmdContent");

function addCommand(text, color) {
    var line = document.createElement("div");
    line.textContent = text;
    if (color) {
        line.style.color = color;
    }
    cmdOutput.appendChild(line);
    cmdContent.scrollTop = cmdContent.scrollHeight;
}


var commandHistory = [];
var historyIndex = -1;

cmdInput.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        var command = cmdInput.value.trim();

        if (command === "") {
            return;
        }

        commandHistory.push(command);
        historyIndex = commandHistory.length;

        addCommand("Kuuppa@KuuppaOS:~$ " + command , "#7cff8a");

        runCommand(command);

        cmdInput.value = "";
    }

    if (e.key === "ArrowUp") {

        if (historyIndex > 0) {
            historyIndex--;
            cmdInput.value = commandHistory[historyIndex];
        }

        e.preventDefault();
    }

    if (e.key === "ArrowDown") {

        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            cmdInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            cmdInput.value = "";
        }

        e.preventDefault();
    }

});

function runCommand(command) {

    var parts = command.split(" ");
    var mainCommand = parts[0].toLowerCase();

    if (mainCommand === "help") {

        addCommand("");
        addCommand("KuuppaOS commands:", "#7cff8a");
        addCommand("");
        addCommand("help       Show this list");
        addCommand("clear      Clear terminal");
        addCommand("time       Show current time and date");
        addCommand("apps       Show installed apps");
        addCommand("about      About KuuppaOS or apps)");
        addCommand("print      Print text");
        addCommand("usage      How to use commands");
        addCommand("delete     delete system32");
        addCommand("");

    }

    else if (mainCommand === "clear") {
        cmdOutput.innerHTML = "";
    }


    else if (mainCommand === "time") {
        var time = new Date().toLocaleTimeString();
        var date = new Date().toLocaleDateString();
        addCommand(time);
        addCommand(date);

    }


    else if (mainCommand === "apps") {

        addCommand("");
        addCommand("Installed apps:", "#7cff8a");
        addCommand("");
        addCommand("Welcome");
        addCommand("TeXtpad");
        addCommand("Weather");
        addCommand("Clock");
        addCommand("KuuppaVid");
        addCommand("KuuppaMusic");
        addCommand("HackCMD");
        addCommand("Terminal");
        addCommand("Paint");
        addCommand("KuuppaBrowser");
        addCommand("Calculator");
        addCommand("Pong");
        addCommand("Camera");
        addCommand("Ghost game");
        addCommand("Info");
        addCommand("");

    }



    else if (mainCommand === "print") {

        var printMatch = command.match(/^print\s+"(.*)"\s*$/i);

        if (printMatch) {
            addCommand(printMatch[1]);
        } else {
            addCommand("Usage: print \"text here\"", "#ff0000");
        }

    }

    else if (mainCommand === "delete" && parts.length > 1) {
      var deleteTarget = parts.slice(1).join(" ").toLowerCase();
      function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
      if (deleteTarget === "system32") {
      (async function () {
        addCommand("Deleting System32...", "#ff0000");
        await sleep(200); addCommand("Deleted file: 'kuuppeli.sys'...", "#ff0000");
        await sleep(200); addCommand("Deleted file: 'style.css'...", "#ff0000");
        document.getElementById("welcome").style.display = "none";
        await sleep(200); addCommand("Deleted file: 'kuuppaos-driver-wlan.drive'...", "#ff0000");
        await sleep(200); addCommand("Deleted file: 'settings.sys'...", "#ff0000");
        await sleep(200); addCommand("Deleted file: 'kuuppaos-driver-camera.drive'...", "#ff0000");
        await sleep(200); addCommand("Deleted file: 'kuuppaos-driver-location.drive'...", "#ff0000");
        await sleep(200); addCommand("Deleted file: 'main.c'...", "#ff0000");
        await sleep(200); addCommand("Deleted file: 'desktop-q.sys'...", "#ff0000");
        document.getElementById("desktopApps").style.display = "none";
        await sleep(200); addCommand("Deleted file: 'webos.html'...", "#ff0000");
        await sleep(200); addCommand("Deleted file: 'kuuppa32.32'...", "#ff0000");
        document.getElementById("top").style.display = "none";
        await sleep(200); addCommand("Deleted file: 'gamma.g'...", "#ff0000");
        await sleep(200); addCommand("Deleted file: 'kuuppa.sgv'...", "#ff0000");
        await sleep(200); addCommand("Deleted file: 'script.js'...", "#ff0000");
        await sleep(200); addCommand("Deleted file: 'index.html'...", "#ff0000");
        await sleep(1000); body.style.display = "none";
      })();
    }else {
        addCommand("Usage 'delete'", "#7cff8a");
        addCommand("'delete system32'")
      }}

      else if (mainCommand === "delete") {
        addCommand("Usage 'delete'", "#7cff8a");
        addCommand("'delete system32'")
      }

   
    else if (mainCommand === "about" && parts.length > 1) {
      var aboutTarget = parts.slice(1).join(" ").toLowerCase();

      if (aboutTarget === "textpad") {
        addCommand("About TeXtpad", "#7cff8a");
        addCommand("You can save info to TeXtpad, but it only has one textbox.")
        addCommand("You can use it for small thoughts that you don't want to forget yet. (it saves locally to your browser!)")
        addCommand("It's basically like notepad, but with only one note.")
      }
      else if (aboutTarget === "welcome") {
      addCommand("About Welcome", "#7cff8a");
      addCommand("This is just the welcome screen with some links.")
    }
      else if (aboutTarget === "weather") {
        addCommand("About Weather", "#7cff8a");
        addCommand("This app shows you your local weather!")
        addCommand("It shows temperature, condition (with text and an emoji) and your location.")
        addCommand("Make sure you have enabled location services for this to work.")
      }
      else if (aboutTarget === "clock") {
        addCommand("About Clock", "#7cff8a");
        addCommand("This app tells you the time.")
        addCommand("There is nothing special about this, it's just an analog clock.")
      }
      else if (aboutTarget === "kuuppamusic") {
        addCommand("About KuuppaMusic", "#7cff8a");
        addCommand("You can listen to spotify's lofi beats playlist.")
        addCommand("All the songs only play for 30 seconds, so this is kind of useless.")
        addCommand("New version coming...")
      }
      else if (aboutTarget === "kuuppavid") {
        addCommand("About KuuppaVid", "#7cff8a");
        addCommand("You can watch any YouTube video with this!")
        addCommand("You only have to know the video id...")
      }
      else if (aboutTarget === "hackcmd") {
        addCommand("About HackCMD", "#7cff8a");
        addCommand("With this app you can seem like you are hacking!")
        addCommand("Just type anything in the terminal window!")
      }
      else if (aboutTarget === "terminal") {
        addCommand("About Terminal", "#7cff8a");
        addCommand("This is the app you're using right now.")
        addCommand("This is just a basic terminal.")
        addCommand("Type 'help' to see all available commands.")
      }
      else if (aboutTarget === "paint") {
        addCommand("About Paint", "#7cff8a");
        addCommand("You can paint anything you want!")
        addCommand("You can change color and size, and also use the eraser or clear the whole canvas.")
        addCommand("After you're done, just press the Download button!")
      }
      else if (aboutTarget === "kuuppabrowser") {
        addCommand("About KuuppaBrowser", "#7cff8a");
        addCommand("You can browse all websites that allow being in an iframe.")
        addCommand("Just type in the URL (like 'wikipedia.org') and press load!")
        addCommand("You can even have KuuppaOS in KuuppaOS.")
      }
      else if (aboutTarget === "calculator") {
        addCommand("About Calculator", "#7cff8a");
        addCommand("This is just a basic calculator.")
        addCommand("Use the buttons or just type your numbers in the textarea and press solve!")
      }
      else if (aboutTarget === "pong") {
        addCommand("About Pong", "#7cff8a");
        addCommand("You can play pong.")
        addCommand("Use your mouse to move. It's that simple!")
        addCommand("You can pause by minimizing the app. Reset by closing it.")
      }
      else if (aboutTarget === "camera") {
        addCommand("About Camera", "#7cff8a");
        addCommand("Take pictures inside KuuppaOS.")
        addCommand("Just press the Take Photo button!")
        addCommand("Then you will see the photo for a few seconds and then your download will start.")
      }
      else if (aboutTarget === "ghostgame") {
        addCommand("About Ghost game", "#7cff8a");
        addCommand("Pacman like game where you try to eat all the ghosts.")
        addCommand("Also everyone can see the best score if you get it!")
        addCommand("I made this a while back in a coding class.")
      }
      else {
        addCommand("No app named '" + aboutTarget + "' found.");
        addCommand("Type 'about' for general info, or 'help' for available commands.");
      }
    }

    else if (mainCommand === "usage" && parts.length > 1) {
      var usageTarget = parts.slice(1).join(" ").toLowerCase();

      if (usageTarget === "about") {
        addCommand("Usage 'about'", "#7cff8a");
        addCommand("'about' for KuuppaOS info, 'about appname' for app info (no spaces, all lowercase).")
      }
      else if (usageTarget === "usage") {
        addCommand("Usage 'usage'", "#7cff8a");
        addCommand("'usage command'")
      }
      else if (usageTarget === "print") {
        addCommand("Usage 'print'", "#7cff8a");
        addCommand(`'print "some words"'`)
      }
      else if (usageTarget === "time") {
        addCommand("Usage 'time'", "#7cff8a");
        addCommand("'time'")
      }
      else if (usageTarget === "help") {
        addCommand("Usage 'help'", "#7cff8a");
        addCommand("'help'")
      }
      else if (usageTarget === "clear") {
        addCommand("Usage 'clear'", "#7cff8a");
        addCommand("'clear'")
      }
      else if (usageTarget === "apps") {
        addCommand("Usage 'apps'", "#7cff8a");
        addCommand("'apps'")
      }
      else if (usageTarget === "delete") {
        addCommand("Usage 'delete'", "#7cff8a");
        addCommand("'delete system32'")
      }
      else {
        addCommand("Usage 'usage'", "#7cff8a");
        addCommand("'usage command'")
      }
    }

    else if (mainCommand === "usage"){
      addCommand("Usage 'usage'", "#7cff8a");
      addCommand("'usage command'")
    }

  else if (mainCommand === "about") {

        var blura = localStorage.getItem(STORAGE_BLUR);
        var wallpa = localStorage.getItem(STORAGE_BG);
        var transa = localStorage.getItem(STORAGE_TRANSPARENT);
        if (blura === null) {
            blura = "0";
        }

        if (transa === null) {
            transa = "0";
        }

        if (wallpa === null) {
            wallpa = "Default";
        } else {
            wallpa = "Custom";
        }


addCommand("================================", "#7cff8a");
addCommand("          KuuppaOS", "#7cff8a");
addCommand("================================", "#7cff8a");
addCommand("User: Kuuppa");
addCommand("Blur: " + blura + "px");
addCommand("Transparency: " + transa + "%");
addCommand("Wallpaper: " + wallpa);
addCommand("================================", "#7cff8a");
addCommand("         About KuuppaOS", "#7cff8a");
addCommand("================================", "#7cff8a");
addCommand("KuuppaOS is a WebOS");
addCommand("Made by @suklaasukkulayt");
addCommand("Languages: HTML, CSS, JS");
addCommand("================================", "#7cff8a");
addCommand("");
    }
        else if (mainCommand === "kuuppa") {
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
      addCommand("kuuppa");
    }

    else {

        addCommand(
            "Command not found: " + mainCommand
        );

        addCommand(
            "Type 'help' for available commands."
        );
    }
}

const width = 1280;
let height = 0;

let streaming = false;
let cameraStream = null;

const video = document.getElementById("video");
const cameracanvas = document.getElementById("cameracanvas");
const photo = document.getElementById("photo");
const startButton = document.getElementById("start-button");
const allowButton = document.getElementById("permissions-button");
const cameraError = document.getElementById("camera-error");

function startCamera() {
  if (cameraStream) return;
  navigator.mediaDevices
    .getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
    .then((stream) => {
      cameraStream = stream;
      video.srcObject = stream;
      video.play();
      if (cameraError) {
        cameraError.textContent = "";
        cameraError.style.display = "none";
      }
    })
    .catch((err) => {
      const message = `Camera error: ${err.message || err}`;
      if (cameraError) {
        cameraError.textContent = message;
        cameraError.style.display = "block";
      } else {
        alert(message);
      }
      console.error(message);
    });
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  video.srcObject = null;
  streaming = false;
}

if (allowButton) {
  allowButton.addEventListener("click", startCamera);
}
video.addEventListener("canplay", (ev) => {
  if (!streaming) {
    height = video.videoHeight / (video.videoWidth / width);

    video.setAttribute("width", width);
    video.setAttribute("height", height);
    cameracanvas.setAttribute("width", width);
    cameracanvas.setAttribute("height", height);
    streaming = true;
  }
});
startButton.addEventListener("click", (ev) => {
  takePicture();
  ev.preventDefault();
});
function clearPhoto() {
  const context = cameracanvas.getContext("2d");
  context.fillStyle = "#aaaaaa";
  context.fillRect(0, 0, cameracanvas.width, cameracanvas.height);

  const data = cameracanvas.toDataURL("image/png");
  photo.setAttribute("src", data);
}

const outputOverlay = document.querySelector(".output");
let photoRevealTimeout = null;

clearPhoto();
function takePicture() {
  const context = cameracanvas.getContext("2d");
  if (width && height) {
    cameracanvas.width = width;
    cameracanvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const data = cameracanvas.toDataURL('image/png');
    photo.setAttribute("src", data);

    if (photoRevealTimeout) {
      clearTimeout(photoRevealTimeout);
    }

    if (outputOverlay) {
      outputOverlay.classList.add("visible");
    }

    photoRevealTimeout = setTimeout(() => {
      if (outputOverlay) {
        outputOverlay.classList.remove("visible");
      }
      downloadPhoto(data);
      photoRevealTimeout = null;
    }, 2000);
  } else {
    clearPhoto();
  }
}

function getPhotoFilename() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const datePart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const timePart = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  return `kuuppaos_photo_${datePart}_${timePart}.png`;
}

function downloadPhoto(dataUrl) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = getPhotoFilename();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const audioPlayer = document.querySelector(".audio-player");
const audio = new Audio(
  "https://stream1.rcast.net/73328"
);

console.dir(audio);

audio.addEventListener(
  "loadeddata",
  () => {
    audio.volume = .75;
  },
  false
);



const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
volumeSlider.addEventListener('click', e => {
  const sliderWidth = window.getComputedStyle(volumeSlider).width;
  const newVolume = e.offsetX / parseInt(sliderWidth);
  audio.volume = newVolume;
  audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
}, false)

setInterval(() => {
  audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(
    audio.currentTime
  );
}, 500);

const playBtn = audioPlayer.querySelector(".controls .toggle-play");
const radioimg = document.getElementById('radioimg');
playBtn.addEventListener(
  "click",
  () => {
    if (audio.paused) {
      audio.src = 'https://stream1.rcast.net/73328';
      playBtn.classList.remove("play");
      playBtn.classList.add("pause");
      audio.play();
      radioimg.src = "./icons/radio-animation.gif"
    } else {
      playBtn.classList.remove("pause");
      playBtn.classList.add("play");
      audio.pause();
      radioimg.src = "./icons/radio.png"
      audio.src = ''
    }
  },
  false
);

audioPlayer.querySelector(".volume-button").addEventListener("click", () => {
  const volumeEl = audioPlayer.querySelector(".volume-container .volume");
  audio.muted = !audio.muted;
  if (audio.muted) {
    volumeEl.classList.remove("icono-volumeMedium");
    volumeEl.classList.add("icono-volumeMute");
  } else {
    volumeEl.classList.add("icono-volumeMedium");
    volumeEl.classList.remove("icono-volumeMute");
  }
});

function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
}

