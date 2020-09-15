
var cityName = $("#searchTerm").val();
var APIKey = "e5cd292e963193f55f39cfb44ae6d9b8";

var date = new Date();



$("#search-button").on("click", function () {
    var cityName = $("#searchTerm").val();

    // clear input box
    $("#searchTerm").val("");

    //url to call API
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        // console.log(response.name);
        // console.log(response.weather[0].icon);
        // console.log(response.main.humidity);
        // console.log(response.wind.speed);
        // console.log(response.)

        getWeather(response);

    });
})

function getWeather(response) {
    //get temp and convert to F
    var tempF = (response.main.temp - 273.15) * 1.8 + 32;
    tempF = Math.floor(tempF);

    // $("#city-name").empty();

    //GET info and set content

    var city = $("#city-name").text(response.name);
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
    $(".city-name").append(city, cityDate, image);
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
        // var forecastEL = $(".forecast")
        $('#forecast').empty();
        for (i = 0; i < results.length; i++) {
            
            var forecastIndex = i * 8 + 4;
            //forecast Date
            var forecastDate = new Date(response.list[i].dt * 1000);
            var forecastDay = forecastDate.getDate();
            var forecastMonth = forecastDate.getMonth() + 1;
            var forecastYear = forecastDate.getFullYear();

            // forecastEL[i].append(forecastDateEL.innerHTML);

            if(results[i].dt_txt.indexOf("12:00:00") !== -1){

            //create card
            var card = $("<div>").addClass("card col-md-2 bg-primary text-white");
            var cardBody = $("<div>").addClass("card-body p-3 forecastBody");
            card.append(cardBody);
            $("#forecast").append(card);

            var forecastDateEL = $("<p>").addClass("card-title").text(date.toLocaleDateString('en-US'));

            var image = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png");

            //temp
            var temp = (response.list[i].main.temp - 273.15) * 1.8 + 32;
            tempFah = Math.floor(temp);
            var temperatureF = $("<p>").addClass("card-text forecastTemp").text("Temp: " + tempFah + "°F");

            //humidity
            var humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + response.list[i].main.humidity + "%");



            // //forecast humidity
            // var forecastHumidityEL = $("<p>").addClass("card-text forecastHumidity");
            // forecastHumidityEL.innerHTML = "Humidity: " + response.list[forecastIndex].main.humidity + "%";
            // console.log(forecastHumidityEL.innerHTML);
            // forecastEL[i].append(forecastHumidityEL.innerHTML);



            //append data to card
            cardBody.append(forecastDateEL, image, temperatureF, humidity);

            }



            // if (results[i].dt_txt.indexOf("12:00:00") !== -1) {
            //     //get temp and convert to F
            //     var temp = (results[i].main.temp - 273.15) * 1.8 + 32;
            //     tempFah = Math.floor(temp);

            //     var card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
            //     var cardBody = $("<div>").addClass("card-body p3 forecastBody");
            //     var cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
            //     var temperature = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + tempFah + " °F");

            //     cardBody.append(cityDate, temperature);
            //     card.append(cardBody);
            //     $("#forecast").append(card);
            // }
        }
    })
    // var buttonList = 
    // var newCityButton
    // newTodoLi.text(cityInput
    // newTodoLi.i.addClass("list-group-item list-group-item-action"))

    // buttonList.append(newCityButton)


};




