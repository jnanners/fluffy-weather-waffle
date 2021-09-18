//NEED HELP:
//getting current date and future dates 
//save city to local storage and having it appear on screen as a button that will show that citys weather
//formatting- i think i have it set up wrong, it looks awful


//DOM Elements
var formLocationEl = document.querySelector("#city-location");
var formInputEl = document.querySelector("#city-name");
var currentWeatherEl = document.querySelector("#current-weather");
var futureWeatherEl = document.querySelector("#weather-forecast");


//when location is submitted
function formEventHandler(event){
    event.preventDefault();
    
    //variable for name of city
    var cityName = formInputEl.value;
    
    //send city name to  get longitude and latitude
    getCoordinates(cityName);
};

// get lat and lon from city name
function getCoordinates(city){
    //create api URL 
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=13a6d70de78d1674a8f27d764dfd1692";

    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                //send lat and lon to funcion to get the weather
                getWeather(data[0].lat, data[0].lon);
            })
        }
        else{
            alert("Error");
        }
    })
}

// get weather for based on lat and lon
function getWeather(lat, lon){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=13a6d70de78d1674a8f27d764dfd1692";
    
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                //send current days info to  put it on webpage
                dailyForecast(data.current.temp, data.current.wind_speed, data.current.humidity, data.current.uvi);
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
function dailyForecast(temp, wind, humidity, uv){
    //create div to hold city name and date
    var cityEl = document.createElement("div");
    cityEl.innerText = formInputEl.value;
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
    uvEl.innerText = "UV Index: " + uv 
    currentWeatherEl.appendChild(uvEl);

    currentWeatherEl.classList.add("border");
    currentWeatherEl.classList.add("border-dark");
};

// loop through array and display 5 day forecast on page
function futureForecast(array){
    //div with 5 day forecast title
    var titleDiv = document.createElement("div");
    titleDiv.innerHTML = "<h2>5-Day Forecast:</h2>";
    futureWeatherEl.appendChild(titleDiv);

    
    for(var i = 1; i < 6; i++){
        //create a div to hold this days forecast
        var weatherDiv = document.createElement("div");
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



formLocationEl.addEventListener("submit", formEventHandler);