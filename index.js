

const userLocation = document.querySelector("[data-userlocation]");
const searchLocation = document.querySelector("[data-searchlocation]");

const grantContainer = document.querySelector(".grant-container");
const searchContainer = document.querySelector(".search-container");
const userWeatherInfoContainer = document.querySelector(".user-weather-info-container");
const loadingImage = document.querySelector(".loading-image");

// const url1 = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
// intialize
let currentTab = userLocation;
currentTab.classList.add("current-tab");
const API_KEY = "804e0f1a33a118a5ae58738576ef396b";
getCordinatesFromSessionStorage();


function switched(clicked){
    if(clicked != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clicked;
        currentTab.classList.add("current-tab");

        if(!searchContainer.classList.contains("active")){
            searchContainer.classList.add("active");
            grantContainer.classList.remove("active");
            userWeatherInfoContainer.classList.remove("active");
        }

        
        else{
            userWeatherInfoContainer.classList.remove("active");
            searchContainer.classList.remove("active");
            getCordinatesFromSessionStorage();
        }
    }

}


userLocation.addEventListener("click",() => {
    switched(userLocation);
})

searchLocation.addEventListener("click" ,() => {
    switched(searchLocation);
})


function getCordinatesFromSessionStorage(){
    const localCordinates = sessionStorage.getItem("user-cordinates");
    if(!localCordinates){
        grantContainer.classList.add("active");
    }


    else{
        const cordinate = JSON.parse(localCordinates);
        fetchUserWeatherInfo(cordinate);
    }
}

async function fetchUserWeatherInfo(cordinate){
    const {latitude , longitude } = cordinate;

    grantContainer.classList.remove("active");
    loadingImage.classList.add("active");
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
   

    try{
        const response = await fetch(url);

        const data = await response.json();

        loadingImage.classList.remove("active");
        userWeatherInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }

    catch(err){
        loadingImage.classList.remove("active");
        alert("please check your API");
    }
}


function renderWeatherInfo(data){
    const cityName = document.querySelector("[data-cityname]");
    const cityIcon = document.querySelector("[data-cityIcon]");
    const weatherDesc = document.querySelector("[data-cityDesc]");
    const temp = document.querySelector("[data-temp]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const windSpeed = document.querySelector("[data-wind]");
    const humidity = document.querySelector("[data-humidity]")
    const cloudiness = document.querySelector("[data-cloudiness]");


    cityName.inneText = data?.name;
    cityIcon.src =  `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = data?.weather?.[0]?.description;
    temp.inneText = data?.main?.temp;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;;
    windSpeed.innerText = data?.wind?.speed;
    humidity.innerText = data?.main?.humidity;
    cloudiness.innerText = data?.clouds?.all;

}


// If incase your coordinates are not available in session Storage the perform this

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    else{
        alert("Your GeoLocations are not available in session Storage");
    }
}

function showPosition(position){
    const userCordinates= {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    };

    sessionStorage.setItem("user-cordinates" , JSON.stringify(userCordinates));
    fetchUserWeatherInfo(userCordinates);
}
const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click", getLocation);


const searchButton = document.querySelector("[data-searchbtn]");
const searchInput = document.querySelector("[data-searchInput]");


searchContainer.addEventListener("submit" , (e) => {
    e.preventDefault();

    let cityName = searchInput.value;
    if(cityName == ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
    
})

async function fetchSearchWeatherInfo(cityName){
    // const Cityurl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    
        loadingImage.classList.add("active");
        grantContainer.classList.remove("active");
        userWeatherInfoContainer.classList.remove("acitve");


        try{
            const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);

            const data = await response.json();
            loadingImage.classList.remove("active");
            userWeatherInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }   
        
        catch(err){
            alert("your cityName API is not working properly")
        }
    }
    
