var APIKey = "e5cd292e963193f55f39cfb44ae6d9b8";
var date = new Date();

function renderCityList(citySearchList) {
    $("#history").empty();
    var keys = Object.keys(citySearchList);
    for (i = 0; i < keys.length; i++) {
        var cityListEntry = $("<button>");
        cityListEntry.addClass("list-group-item list-group-item-action");

        var splitStr = keys[i].toLowerCase().split(" ");
        for (var j = 0; j < splitStr.length; j++) {
            splitStr[j] =
                splitStr[j].charAt(0).toUpperCase() + splitStr[j].substring(1);
        }
        var titleCasedCity = splitStr.join(" ");
        cityListEntry.text(titleCasedCity);

        $("#history").append(cityListEntry);
    };
};

function getWeather(city, citySearchList) {
    renderCityList(citySearchList);
    // clear input box
    $("#searchTerm").val("");

    //url to call API
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        //GET temp and convert to F
        var tempF = (response.main.temp - 273.15) * 1.8 + 32;
        tempF = Math.floor(tempF);

        var cityName = $("#city-name").text(response.name);
        var cityDate = $("<h4>").addClass("city-name").text(date.toLocaleDateString('en-US'));
        var temperature = $("#temperature").text("Temperature: " + tempF + " °F");
        var humidity = $("#humidity").text("Humidity: " + response.main.humidity);
        var windSpeed = $("#wind-speed").text("Wind Speed: " + response.wind.speed);
        var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
        $.ajax({
            url: UVQueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response[0].value);
            var UVindex = $("#UV-index").text("UV Index: " + response[0].value);
            UVindex.attr("class", "badge badge-danger");
            $("#UV-index").append(UVindex);
        })

        //append to page
        $(".city-name").append(cityName, cityDate, image);
        $("#temperature").append(temperature);
        $("#humidity").append(humidity);
        $("#wind-speed").append(windSpeed);

        //Using the city ID, generate a 5-day forecase get request from open weather API
        var cityID = response.id;
        console.log(cityID);
        var ForecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
        $.ajax({
            url: ForecastQueryURL,
            method: "GET"
        }).then(function (response) {

            //Parse response to display forecase for next 5 days
            console.log(response)
            var results = response.list;
            console.log(results);

            //empty #forecast 
            $('#forecast').empty();

            for (i = 0; i < results.length; i++) {

                //forecast Date
                var forecastDate = new Date(response.list[i].dt * 1000);
                var forecastDay = forecastDate.getDate();
                var forecastMonth = forecastDate.getMonth() + 1;
                var forecastYear = forecastDate.getFullYear();

                if (results[i].dt_txt.indexOf("12:00:00") !== -1) {

                    //create card
                    var card = $("<div>").addClass("card col-md-2 bg-primary text-white");
                    var cardBody = $("<div>").addClass("card-body p-3 forecastBody");
                    card.append(cardBody);
                    $("#forecast").append(card);

                    var forecastDateEL = $("<h5>").addClass("card-title").text(forecastMonth + "/" + forecastDay + "/" + forecastYear);

                    //Weather Icom
                    var weatherImage = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png");
                    weatherImage.addClass("card-image");

                    //temp
                    var temp = (response.list[i].main.temp - 273.15) * 1.8 + 32;
                    tempFah = Math.floor(temp);
                    var temperatureF = $("<p>").addClass("card-text forecastTemp").text("Temp: " + tempFah + " °F");

                    //humidity
                    var humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + response.list[i].main.humidity + "%");


                    //append data to card
                    cardBody.append(forecastDateEL, weatherImage, temperatureF, humidity);

                }

            }
        });
    });

};

$(document).ready(function () {
    var citySearchListStringified = localStorage.getItem("citySearchList");

    var citySearchList = JSON.parse(citySearchListStringified);

    if(citySearchList == null){
        citySearchList = {};
    }

    renderCityList(citySearchList);

    //button on-click to kick off function
    $("#search-button").on("click", function (event) {
        event.preventDefault();
        var city = $("#searchTerm")
            .val()
            .trim()
            .toLowerCase();

        if (city != "") {
            citySearchList[city] = true;
            localStorage.setItem("citySearchList", JSON.stringify(citySearchList));

            getWeather(city, citySearchList);
            $("#forecastH3").show();
        }

    });

    $("#history").on("click", "button", function(event){
        event.preventDefault();
        var city = $(this).text();
        $("#forecastH3").show();
        getWeather(city, citySearchList);

    });

    $("#clear-history").on("click", function () {
        localStorage.clear();
        $("#history").empty();
        history.go(0);
    });

});






