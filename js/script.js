let searchArr = [];
let APIKey = "&appid=de6bb623e95b6c13d55f60f81ac75405"

$(document).ready(function () {

    storeCity();

    $("#search-button").click(function (event) {
        event.preventDefault();
        $("#current-city").empty();
        $("#five-day").empty();

        let searchTerm = $("#city-input").val().trim();
        clickSearch(searchTerm);
        // searchArr.push(searchTerm);

    })

    function clickSearch(searchTerm) {

        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + APIKey;


        // creating buttons of every city search
        $(`<button class="city-button">`).appendTo(".stored-cities").prepend(searchTerm);

        // ajax call for local weather
        $.ajax({
            type: "GET",
            url: queryURL
        }).then(function (response) {

            let previousCity = JSON.parse(localStorage.getItem("cities"));
            if (previousCity) {
                previousCity.push(response.name);
                localStorage.setItem("cities", JSON.stringify(previousCity));
            } else {
                searchArr.push(response.name)
                localStorage.setItem("cities", JSON.stringify(searchArr));
            }
            $("h1").text(JSON.stringify(response));
            let currentDate = moment().format('l');


            //transfer content to HTML
            let cityName = $("<h1>").text(searchTerm + " " + "(" + currentDate + ")");
            let windData = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
            let humidityData = $("<p>").text("Humidity: " + response.main.humidity + "%");
            let iconcode = response.weather[0].icon;
            let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
            let weatherImg = $("<img>").attr("src", iconurl);

            // Convert the temp to fahrenheit
            let tempF = (response.main.temp - 273.15) * 1.80 + 32;
            let roundedTemp = Math.floor(tempF);

            // temp elements added to html
            let tempDataF = $("<p>").text("Temp (F): " + roundedTemp + "°");

            // append the elements together
            cityName.append(weatherImg, windData, humidityData, tempDataF);


            $("#current-city").append(cityName);




            let lat = response.coord.lat;
            let lon = response.coord.lon;

            // AJAX call or UV Index
            let UVIndexURL = "http://api.openweathermap.org/data/2.5/uvi?" + APIKey + "&lat=" + lat + "&lon=" + lon;

            $.ajax({
                method: "GET",
                url: UVIndexURL,
            }).then(function (currentUV) {
                let displayUV = $("<p id='uv-index'>").text("UV Index: " + currentUV.value);
                $("#current-city").append(displayUV)

                // CSS changes depending on uvindex value
                if (currentUV.value >= 0 && currentUV.value < 3) {
                    $("#uv-index").addClass("badge-success");
                } else if (currentUV.value >= 3 && currentUV.value < 8) {
                    $("#uv-index").addClass("badge-warning");
                } else if (currentUV.value >= 8) {
                    $("#uv-index").addClass("badge-danger");
                }
            })

            // AJAX url and call for Five Day Forecast
            let fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + APIKey;

            $.ajax({
                method: "GET",
                url: fiveDayQueryURL,
            }).then(function (responseFiveDay) {
                console.log(responseFiveDay);


                // for loop for creating 5 cards for a 5 day forecast
                // let  = response5Day.daily;
                for (let i = 1; i < 6; i++) {

                    

                    let fiveDayElement = $("<div class='card bg-primary' style = width: 10rem; margin: 10px;'>")
                    let fiveDayDate = responseFiveDay.daily[i].dt;
                    let date = fiveDayDate;
                    let fiveDayTemp = responseFiveDay.daily[i].temp.day;
                    let fiveDayHumid = responseFiveDay.daily[i].humidity;
                    let fiveDayCard = $("<div class='card-body bg-primary'>");
                    let fiveDayDateEl = $("<h5 class='card-title bg-primary'>");
                    let fiveDayTempEl = $("<p class='card-text bg-primary'>").text("Temp: " + fiveDayTemp + "° F");
                    let fiveDayHumEl = $("<p class='card-text bg-primary'>").text("Humidity: " + fiveDayHumid + "%");
                    let fiveDayIcon = "https://openweathermap.org/img/wn/" + responseFiveDay.daily[i].weather[0].icon + "@2x.png"
                    let fiveDayImg = $("<img>");
                    fiveDayImg.attr("src", fiveDayIcon);
                    fiveDayCard.append(fiveDayDateEl).text("Date: " + moment.unix(fiveDayDate).format("MM/DD/YYYY"));
                    fiveDayCard.append(fiveDayImg);
                    fiveDayCard.append(fiveDayTempEl);
                    fiveDayCard.append(fiveDayHumEl);
                    fiveDayElement.append(fiveDayCard);
                    $("#five-day").append(fiveDayElement);
                    
                }
            });

        });
    }
    
    $(document).on("click", ".city-button", function () {
        $("#current-city").empty();
        $("#five-day").empty();
        JSON.parse(localStorage.getItem("cities"));
        let citySearch = $(this).text();
        clickSearch(citySearch);
    });

    function storeCity() {
        let searchList = JSON.parse(localStorage.getItem("cities"));
        $(".stored-cities").empty();
        if (searchList) {
            for (i = 0; i < searchList.length; i++) {
                let listBtn = $(`<button class="city-button">`).attr('id', 'cityname_' + (i + 1)).text(searchList[i]);
                let listElem = $("<li>").attr('class', 'list-group-item');
                listElem.append(listBtn);
                $(".stored-cities").append(listElem);
            }

        }

    }
});



// localStorage.setItem(searchTerm, JSON.stringify(searchArr));
// for (let c = 0; c < searchArr.length; c++) {
//     $(`<button class="city-button">`).text(searchTerm).prepend(".stored-cities");
// }

    // let lastCity = JSON.parse(localStorage.getItem(searchTerm));
    // let storedList = $(`<button class="city-button">`).text(lastCity);
    // console.log(lastCity)
    // if (lastCity === null) {
    //     $(".list-btn").hide();
    //     console.log($("#city-button"))
    // } else {
    //     $(".list-btn").show();

    //     $("#city-list").append(storedList);
    //     weatherSearch(lastCity);
    // }


