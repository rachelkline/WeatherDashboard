function loadPage() {
    var userInput = $("#city-input");
    var searchBtn = $("#search-button");
    var clearHist = $("#clear-history");
    var cityName = $("#city-name");
    var currentPic = $("#current-pic");
    var currentTemp = $("#temperature");
    var currentHumidity = ("#humidity");
    var currentWind = $("#wind-speed");
    var currentUV = $("#UV-index");
    var userHistory = $("#history");
    var searchHistory = JSON.parse(localStorage.getItem("search")) || [];


    var APIkey = "d840f8a80da5144fe4e7592c77bb28b0";

    //When the user clicks the search button, the city they typed in is read
    //Using the saved city name, get request from open weather map api
    function getWeather(cityName) {
        var queryURL = "api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIkey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            //Parse response (display current conditons)
            var currentDay = new Date(response.data.dt * 1000);
            console.log(currentDay);
            var day = currentDay.getDate();
            var month = currentDay.getMonth();
            var year = currentDate.getFullYear();
            cityName.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
            var weatherP = response.data.weather[0].icon;
            currentPic.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherP + "@2x.png");
            currentPic.setAttribute("alt", response.data.weather[0].description);
            currentTemp.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
            currentHumidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
            currentWind.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

            var lat = response.data.coord.lat;
            var lon = response.data.coord.lon;
            var UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
            $.ajax({
                url: UVQueryURL,
                method: "GET"
            }).then(function (response) {
                var UVIndex = $("<span>");
                UVIndex.setAttribute("class", "badge badge-danger");
                UVIndex.innerHTML = response.data[0].value;
                currentUV.innerHTML = "UV Index: ";
                currentUV.append(UVIndex);
            });
            //Execute a 5-day forecast get request from open weather map api using city name
            var cityID = response.data.id;
            var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
            $.ajax({
                url: forecastQueryURL,
                method: "GET"
            }).then(function (response) {
                //Parse response (display 5 day forecast)
                console.log(response);
                var forecastEL = $(".forecast");
                for (i = 0; i < forecastEL.length; i++) {
                    var forecastIndex = i * 8 + 4;
                    var forecastDate = new Date(response.data.list[forecaseIndex].dt * 1000);
                    var forecastDay = forecastDate.getDate();
                    var forecastMonth = forecastDate.getMonth();
                    var forecastYear = forecastDate.getFullYear();
                    var forecastDateEl = document.createElement("p");
                    forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                    forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                    forecastEls[i].append(forecastDateEl);
                    var forecastWeatherEl = document.createElement("img");
                    forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                    forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                    forecastEls[i].append(forecastWeatherEl);
                    var forecastTempEl = document.createElement("p");
                    forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                    forecastEls[i].append(forecastTempEl);
                    var forecastHumidityEl = document.createElement("p");
                    forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                    forecastEls[i].append(forecastHumidityEl);
                }
            })
        });
    };

    searchBtn.addEventListener("click", function () {
        var searchTerm = userInput.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    clearHist.addEventListener("click", function () {
        searchHistory = [];
        renderSearchHistory();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    function renderSearchHistory() {
        userHistory.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            // <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="email@example.com"></input>
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function () {
                getWeather(historyItem.value);
            })
            userHistory.append(historyItem);
        }
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }


}
loadPage();






//Save user's search requests and display them

//When the page loads, generate the current conditions & 5-day forecast for last searched city