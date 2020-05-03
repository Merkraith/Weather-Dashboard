let city = $(".city");
let wind = $(".wind");
let humidity = $(".humidity");
let temp = $(".temp");

let searchArr = [];
let APIKey = "&appid=de6bb623e95b6c13d55f60f81ac75405";

$(document).ready(function () {

    $("#search-button").click(function (event) {
        event.preventDefault();

        //grab search term from input search field
        let searchTerm = $("#city-input").val().trim();
        // construct the URL
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + APIKey;

        // add name of search term to search array 
        searchArr.push(searchTerm);

        // add search term to top of list of cities
        $(`<button class="city-button">`).text(searchTerm).prepend(".stored-cities");

        // ajax call for local weather
        $.ajax({
            type: "GET",
            url: queryURL
        }).then(function (response) {
            $("h1").text(JSON.stringify(response));
            //log queryURL
            console.log(queryURL);
            //log the resulting object
            console.log(response);
            //transfer content to HTML
            let cityName = $("#current-city").text(searchTerm + " Weather Details");
            let windData = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
            let humidityData = $("<p>").text("Humidity: " + response.main.humidity + "%");
            let iconcode = response.weather[0].icon;
            let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
            let weatherImg = $("<img>").attr("src", iconurl);

            // Convert the temp to fahrenheit
            let tempF = (response.main.temp - 273.15) * 1.80 + 32;
            let roundedTemp = Math.floor(tempF);

            // temp elements added to html
            let tempData = $("<p>").text("Temp (K): " + response.main.temp + "°");
            let tempDataF = $("<p>").text("Temp (F): " + roundedTemp + "°");

            // append the elements together
            cityName.append(weatherImg, windData, humidityData, tempData, tempDataF);

            $("container").append(cityName);


            // creating buttons of every city search
            $("<p>").appendTo(".stored-cities").prepend(searchTerm);

            let lat = response.coord.lat;
            let lon = response.coord.lon;

            // AJAX call or UV Index
            let UVIndexURL = "http://api.openweathermap.org/data/2.5/uvi?" + APIKey + "&lat=" + lat + "&lon=" + lon;

            $.ajax({
                type: "GET",
                url: UVIndexURL,
            }).then(function (responseUVIndex) {
                console.log(responseUVIndex);

                let currentUV = $("#uv-index").text("UV Index: " + responseUVIndex.value);

                if (currentUV >= 0 && currentUV < 3) {
                    $("#uv-index").addClass("badge-success");
                } else if (currentUV >= 3 && currentUV < 8) {
                    $("#uv-index").addClass("badge-warning");
                } else if (currentUV >= 8) {
                    $("#uv-index").addClass("badge-danger");
                }
                $("container").append(currentUV)
            })




            // AJAX call for Five Day Forecast
            let fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + APIKey;

            $.ajax({
                type: "GET",
                url: fiveDayQueryURL,
            }).then(function (response5Day) {
                console.log(response5Day);
                // console.log(response5Day.list[0].main.temp)

                //     for (var i = 0; i < 6; i++) {

                //     }
                // })


            });

        });
    });
});
