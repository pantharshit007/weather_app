// importing API_KEY
import {api_KEY} from "/APIKEY.js";

const heading = document.querySelector("h1");
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccess = document.querySelector(".grant-location");
const grantAccessBtn = document.querySelector("[data-grantAccess]");
const searchForm = document.querySelector("[data-searchForm]");
const searchInput = document.querySelector("[data-searchInput]")
const loadingScreen = document.querySelector(".loading-container");
const errorScreen = document.querySelector(".error-container");
const errorText = document.querySelector("[data-cityNotFound");

const userInfo = document.querySelector(".user-info");

// user Weather Info- fetched classes
const cityName = document.querySelector("[data-cityName]");
const countryIcon = document.querySelector("[data-countryIcon]");
const desc = document.querySelector("[data-weatherDesc]");
const weatherIcon = document.querySelector("[data-weatherIcon]");
const temp = document.querySelector("[data-temp]");
const windSpeed = document.querySelector("[data-speed]");
const humidity = document.querySelector("[data-humidity]");
const cloudiness = document.querySelector("[data-cloudiness]"); 

heading.classList.add('active')
let currentTab = userTab;   
currentTab.classList.add("current-tab");
const API_KEY = api_KEY;
getFromSessionStorage();    //in case we already have the location [stored prev]
let errCityName = ""

userTab.addEventListener('click', () => switchTab(userTab));

searchTab.addEventListener('click', () => switchTab(searchTab));

grantAccessBtn.addEventListener('click',()=> getLocation());

searchForm.addEventListener('submit',(event) => {

    event.preventDefault();
    heading.classList.remove('active'); //removing heading
    let cityName = searchInput.value;
    if (cityName === "") return;
    errCityName = cityName;
    fetchSearchInfo(cityName);
    searchInput.value = "";
    cityName = "";
    setTimeout(() => {
        scrollToBottom();
    }, 2000);
});

// function to switch Tab
function switchTab(clickedtab) {
    if (clickedtab !== currentTab) {
        currentTab.classList.remove('current-tab');
        currentTab = clickedtab;
        clickedtab.classList.add('current-tab'); 

        // clicking Search
        if (!searchForm.classList.contains('active')){
            userInfo.classList.remove('active');
            grantAccess.classList.remove('active');
            searchForm.classList.add('active');
        }else{
            searchForm.classList.remove('active');
            userInfo.classList.remove('active');
            errorScreen.classList.remove('active');
            heading.classList.add('active');
            getFromSessionStorage();
        }
    }
}

// checking if coords are already in session
function getFromSessionStorage() {
    const localCorrdinates = sessionStorage.getItem('user-coordinates');
    if (!localCorrdinates) {
        grantAccess.classList.add('active');
    }
    else{
        const coordinates = JSON.parse(localCorrdinates);
        fetchUserWeatherData(coordinates);
    }
}

//fetching the weather data based on coordinates
async function fetchUserWeatherData(coords) {
    const { lat, long } = coords;

    grantAccess.classList.remove('active');
    // Load the loading screen
    loadingScreen.classList.add('active');

    // API call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather/?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        // console.log("User - Api Fetch Data", data);

        loadingScreen.classList.remove('active');
        userInfo.classList.add('active');
        renderWeatherData(data);
    } catch (err) {
        // console.log("User - Api Fetch Error", err.message);
        loadingScreen.classList.remove('active');
        console.error("fetchUserWeatherData: " + err.message);
    }
}

//using the accurired data from API call
function renderWeatherData(data){
    // console.log("Weather Info", data);
    cityName.textContent = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.textContent = data?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@2x.png`
    temp.innerText = `${data?.main?.temp.toFixed(2)} °C`;
    windSpeed.innerText = `${data?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    cloudiness.innerText = data?.clouds?.all+ "%";

}

//fetching Location
function getLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // pending
        (err)=>
        {
            console.error("getLocation: " + err.message);;
            window.alert("Geolocation error: "+ err.message);
        }
    }
}

//showing location
function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        long: position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherData(userCoordinates);
}

//Searched City Weather Info
async function fetchSearchInfo(city){
    loadingScreen.classList.add('active');
    userInfo.classList.remove('active');
    errorScreen.classList.remove('active');
    grantAccess.classList.remove('active');

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            // If the response status is not OK (e.g., 404 Not Found, 500 Internal Server Error),
            // handle the error accordingly. 
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();

        loadingScreen.classList.remove('active');
        userInfo.classList.add('active');
        renderWeatherData(data);
    }
    catch(err){
        loadingScreen.classList.remove('active');
        errorScreen.classList.add('active');
        showErrorScreen(err);
        console.error("fetchSearchInfo: " + err.message);
    }
}

//error Screen
function showErrorScreen(){
    errorText.innerHTML = "";
    errorText.innerHTML = `City <span>${errCityName}</span> Not Found. Try Again!`;
    // console.log("Error: " + err);

}

// Scroll to the bottom of the screen
function scrollToBottom() {
    // console.log('Scrolling to the bottom...');
    window.scroll({ top: 2500, left: 0, behavior: 'smooth' });
    //not working :/
}
