//DOM Elements
var formLocationEl = document.querySelector("#city-location");
var searchBtnEl = document.querySelector("#searchBtn");
var formInputEl = document.querySelector("#city-name");
var currentWeatherEl = document.querySelector("#current-weather");
var futureWeatherEl = document.querySelector("#weather-forecast");
var futureWeatherTitleEl = document.querySelector("#weather-forecast-title");
var historyBtnsEl = document.querySelector("#history");

var oldSearches = JSON.parse(localStorage.getItem("search")) || [];

//when location is submitted
function formEventHandler(event){
    event.preventDefault();
    
    //variable for name of city
    var cityName = formInputEl.value;

    //create button in history section
    if(oldSearches.indexOf(cityName) === -1){
        oldSearches.push(cityName);
        var buttonEl = document.createElement("button");
        buttonEl.innerText = cityName;
        buttonEl.addEventListener("click", function(){
            getCoordinates(cityName);
        });
        historyBtnsEl.appendChild(buttonEl);
    }
    
    //send city name to  get longitude and latitude
    getCoordinates(cityName);

    saveSearches();
};

function saveSearches(){
    localStorage.setItem("search", JSON.stringify(oldSearches));
};

function loadSearches(){
    var searches = localStorage.getItem("search");

    if(!searches){
        searches = [];
        return false;
    }

    searches = JSON.parse(searches);

    searches.forEach(function(name){
        var buttonEl = document.createElement("button");
        buttonEl.innerText = name;
        buttonEl.addEventListener("click", function(){
            getCoordinates(name);
        })
        
        historyBtnsEl.appendChild(buttonEl);
    })
};

// get lat and lon from city name
function getCoordinates(city){
    //create api URL 
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=13a6d70de78d1674a8f27d764dfd1692";

    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                //send lat and lon to funcion to get the weather
                getWeather(data[0].lat, data[0].lon, city);
            })
        }
        else{
            alert("Error");
        }
    })
}

// get weather for based on lat and lon
function getWeather(lat, lon, city){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=13a6d70de78d1674a8f27d764dfd1692";
    
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                //send current days info to  put it on webpage
                dailyForecast(data.current.temp, data.current.wind_speed, data.current.humidity, data.current.uvi, data.current.weather[0].icon, city);
                //send futurecast array to  display 5 day forecast
                futureForecast(data.daily);
            })
        }
        else{
            alert("Error");
        }
    })
};

// put daily forecast info on page
function dailyForecast(temp, wind, humidity, uv, icon, city){
    currentWeatherEl.textContent = "";

    //create img element for icon
    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
    //variable for current date
    var currentDate = moment().format("(MM/DD/YYYY)");
    //create div to hold city name and date
    var cityEl = document.createElement("div");
    cityEl.innerText = city + currentDate;
    cityEl.appendChild(iconEl);
    currentWeatherEl.appendChild(cityEl);

    //create div to hold current temp
    var tempEl = document.createElement("div");
    tempEl.innerText = "Temp: " + temp + "\xB0F";
    currentWeatherEl.appendChild(tempEl);

    //create div to hold current wind
    var windEl = document.createElement("div");
    windEl.innerText = "Wind: " + wind + " MPH";
    currentWeatherEl.appendChild(windEl);

    //create div to hold current humidity
    var humidityEl = document.createElement("div");
    humidityEl.innerText = "Humidity: " + humidity + " %";
    currentWeatherEl.appendChild(humidityEl);

    //create div to hold current uv index
    var uvEl = document.createElement("div");
    var uvNum = document.createElement("span");
    uvNum.setAttribute("id", "uv-span");
    uvNum.innerText = uv
    uvEl.innerText = "UV Index: "
    uvEl.appendChild(uvNum);
    if(uv <= 3){
        uvNum.style.backgroundColor = "green";
    }
    else if(uv > 6){
        uvNum.style.backgroundColor = "red";
    }
    else{
        uvNum.style.backgroundColor = "yellow";
    }
    currentWeatherEl.appendChild(uvEl);

    currentWeatherEl.classList.add("border");
    currentWeatherEl.classList.add("border-dark");
};

// loop through array and display 5 day forecast on page
function futureForecast(array){
    
    futureWeatherTitleEl.innerText = "5-Day Forecast:"

    futureWeatherEl.textContent = "";
    
    for(var i = 1; i < 6; i++){
        //create a div to hold this days forecast
        var weatherDiv = document.createElement("div");
        weatherDiv.classList.add("forecast-card");
        //create a div to hold this days date
        var currentDate = moment().add(i, "days").format("MM/DD/YYYY");
        weatherDiv.textContent = currentDate;
        //create img for weather icon
        var iconEl = document.createElement("img");
        iconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + array[i].weather[0].icon + "@2x.png")
        weatherDiv.appendChild(iconEl);
        //create a div to hold this days temp, append to weatherDiv
        var tempDiv = document.createElement("div");
        tempDiv.innerText = "Temp: " + array[i].temp.day + "\xB0F";
        weatherDiv.appendChild(tempDiv);
        //create a div to hold this days wind, append to weatherDiv
        var windDiv = document.createElement("div");
        windDiv.innerText = "Wind: " + array[i].wind_speed + " MPH";
        weatherDiv.appendChild(windDiv);
        //create a div to hold this days humidity, append to weatherDiv
        var humidityDiv = document.createElement("div");
        humidityDiv.innerText = "Humidity: " + array[i].humidity + " %";
        weatherDiv.appendChild(humidityDiv);
        //append weatherDiv to page
        futureWeatherEl.appendChild(weatherDiv);
    }
}


searchBtnEl.addEventListener("click", formEventHandler);

loadSearches();