      function timeUpdate() {
      var currentTime = new Date().toLocaleString();
      var timeText = document.querySelector("#timebarElement");
      timeText.innerHTML = currentTime
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

var welcomeScreen = document.querySelector("#welcome")
function closeWindow(element) {
  if (element) {
    element.style.display = "none"
  }
}
function openAllWindows() {
  document.querySelectorAll(".welcome").forEach(function(windowElement) {
    openWindow(windowElement);
  });
}
var welcomeScreenClose = document.querySelector("#welcomeclose")

var welcomeScreenOpen = document.querySelector("#welcomeopen")

welcomeScreenClose.addEventListener("click", function() {
  closeWindow(welcomeScreen);
});

welcomeScreenOpen.addEventListener("click", function() {
  openAllWindows();
});


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
    closeWindow(windowElement);
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

var biggestIndex = 1;
var topBar = document.querySelector("#top")

function handleWindowTap(element) {
  biggestIndex++;  // Increment biggestIndex by 1
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
}

function addWindowTapHandling(element) {
  if (element) {
    element.addEventListener("mousedown", () => handleWindowTap(element));
  }
}

function startYoutubeVideo() {
  const youtubeIframe = document.querySelector("#youtube iframe");
  if (!youtubeIframe) {
    return;
  }

  const baseUrl = "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?si=tXG8A6jRPrfr1sIk";
  youtubeIframe.src = `${baseUrl}&autoplay=1`;
}

function openWindow(element) {
  if (element) {
    element.style.display = "flex";
    biggestIndex++;  // Increment biggestIndex by 1
    element.style.zIndex = biggestIndex;
    topBar.style.zIndex = biggestIndex + 1;

    if (element.id === "youtube") {
      startYoutubeVideo();
    }
  }
}

// Add click handling to bring windows to front
addWindowTapHandling(welcomeScreen);
addWindowTapHandling(textpadScreen);
addWindowTapHandling(weatherScreen);
addWindowTapHandling(clockScreen);
addWindowTapHandling(spotifyScreen);
addWindowTapHandling(youtubeScreen);

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