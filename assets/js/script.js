var city = "";
var currentDate = moment().format('MM/DD/YYYY');
var searchBtn = $(".searchBtn");
var APIKey = "bdf756b4f0f7eef1616eb378786101f4";

function getCurrentWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        var weathericon = response.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/" + weathericon + ".png";
        $("#currentCity").html(response.name + " (" + currentDate + ")" + "<img src=" + iconurl + ">");

        $("#currentTemp").text("Temp: " + response.main.temp + "°F");

        $("#currentWind").text("Wind: " + response.wind.speed + "MPH");

        $("#currentHumidity").text("Humidity: " + response.main.humidity + "%");

        getUVIndex(response.coord.lon, response.coord.lat);
    })
};

function getUVIndex(ln, lt) {
    var uvqURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lt + "&lon=" + ln;
    $.ajax({
        url: uvqURL,
        method: "GET"
    }).then(function (response) {
        $(currentUV).html("UV Index: " + response.value);
    });
};

function getForecast(city) {
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=" + APIKey;
    console.log(forecastURL, city);
    $.ajax({
        url: forecastURL,
        method: "GET",
    }).then(function (response) {

        for (let i = 0; i < 5; i++) {
            var weatherIcon = response.list[i].weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
            $("#date-" + (i+1)).html(moment().add(1, 'days').format('MM/DD/YYYY') + "<img src=" + iconurl + ">");
            $("#temp-" + (i+1)).text("Temp: " + response.list[i].main.temp+ "°F");
            $("#wind-" + (i+1)).text("Wind: " + response.list[i].wind.speed + "MPH");
            $("#humidity-" + (i+1)).text("Humidity: " + response.list[i].main.humidity + "%");
        };
    });
};

var cityArray = JSON.parse(localStorage.getItem("cities"));

cityArray.forEach(loadCityButton);

function loadCityButton(city){
    var cityButton = $("<button>");
    cityButton.text(city);
    $(".saved-cities").prepend(cityButton);
    //city button takes you to that city's weather
    cityButton.on("click", function (event) {
        // city = $("#searched-city").val().trim();
        event.preventDefault();
        getCurrentWeather(city);
        getForecast(city);
    });
};

function saveCity (city) {
    //save city to localStorage
    cityArray.push(city)
    localStorage.setItem("cities", JSON.stringify(cityArray));
    //retrieve city from localStorage
    var value = localStorage.getItem("cities");
    //create city button
    // loadCityButton(city);
    $(".saved-cities").text("")
    cityArray.forEach(loadCityButton); 
};

searchBtn.on("click", function (event) {
    city = $("#searched-city").val().trim();
    event.preventDefault();
    getCurrentWeather(city);
    getForecast(city);
    saveCity(city);
});