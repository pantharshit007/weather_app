const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccess = document.querySelector(".grant-location");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");

const userInfo = document.querySelector(".user-info");

// user Weather Info- fetched classes
const cityName = document.querySelector("[data-cityName]");
const countryIcon = document.querySelector("[data-countryIcon]");
const desc = document.querySelector("[data-weatherDesc]");
const weatherIcon = document.querySelector("[data-weatherIcon]");
const temp = document.querySelector("[data-temp]");
const windSpeed = document.querySelector("[data-windSpeed]");
const humidity = document.querySelector("[data-humdity]");
const cloudiness = document.querySelector("[data-cloudiness]");

let currentTab = userTab;   
currentTab.classList.add("current-tab");
// const API_KEY = "08267dbaaf304f50d2ca93a67d2b5f8f";

userTab.addEventListener('click', () => {
    switchTab(userTab);
});

searchTab.addEventListener('click', () => {
    switchTab(searchTab);
});

// function to switch Tab
function switchTab(clickedtab) {
    if (clickedtab !== currentTab) {
        currentTab.classList.remove('current-tab');
        currentTab = clickedtab;
        clickedtab.classList.add('current-tab'); 

        if (!searchForm.classList.contains('active')){
            userInfo.classList.remove('active');
            grantAccess.classList.remove('active');
            searchForm.classList.add('active');
        }else{
            searchForm.classList.remove('active');
            userInfo.classList.remove('active');
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
    const {lat, long} = coords;

    grantAccess.classList.remove('active');
    // Load the loading screen
    loadingScreen.classList.add('active');

    //APi call
    try{
        const response = await fetch(`https://api.openweather.org/data/2.5/weather/?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove('active');
        userInfo.classList.add('active');
        renderWeatherData(data);
    }
    catch(err){
        loadingScreen.classList.remove('active');
        console.error(err);
    }
}

//using the accurired data from API call
function renderWeatherData(data){


}

// https://api.openweathermap.org/data/2.5/weather?q=jammu&appid=08267dbaaf304f50d2ca93a67d2b5f8f