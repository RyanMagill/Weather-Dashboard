var historyList =[];
//var currentCity = "";
//var city;
const APIKey = "893e5eb06b35f15e6d61f176a6b3ab0b";
var actLat;
var actLon;


$(document).ready(function () {
    console.log('test')
    historyList = JSON.parse(localStorage.getItem("historyList"));;
    
    if (historyList === null) {
        historyList = [];
    }

    $(historyList).each(function(index, element){
        addButton(element);
    });
    $("#city-btn").click((event) => {
        var cityName = $(this).text();
        searchCity(cityName);
    });
    $("#sButton").click((event) => {
        console.log("clicked")
        var city = $("input").val();
        searchCity(city);
        if ($.inArray(city, historyList) > -1){
            return;
        }
        addButton(city);
        historyList.push(city);
        localStorage.setItem("historyList", JSON.stringify(historyList));
    });
});

function getWeather(city){
    //document.getElementById("currentCity").innerHTML = JSON.stringify(city);
    var wURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + APIKey;
    
    $.ajax({
        url: wURL,
        method: "GET"
    }).then((response) =>{
        console.log(response);
        var dateTime = (" " + moment(response.dt, "X").format("MM/DD/YYYY"));
        $("#currentCity").text(response.name + " " + dateTime);
        $("#currentCityTemp").text(response.main.temp);
        $("#currentCityHumidity").text(response.main.humidity);
        $("#currentCityWS").text(response.wind.speed);
        //$("#currentCityUV").append(response..speed);
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        getUV(lat,lon);

    });

    var fURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=" + APIKey;
    $.ajax({
        url: fURL,
        method: "GET"
    }).then(function (response) {
        var dateTime = (" " + moment(response.list[0].dt, "X").format("MM/DD/YYYY"));
        var dateArray = [];
        dateArray[0] = document.getElementById("card1");
        dateArray[1] = document.getElementById("card2");
        dateArray[2] = document.getElementById("card3");
        dateArray[3] = document.getElementById("card4");
        dateArray[4] = document.getElementById("card5");
        console.log(dateArray);
        function getForecast(dateTime, response){
            $("#dateFive").text(dateTime);
            $("#tempFive").append(response.list.main.temp);
            $("#iconFive").append("<img src=\"http://openweathermap.org/img/w/" + response.list.weather.icon + ".png\">");
            $("#humidityFive").text(response.list.main.humidity);
        }
        console.log(response);

        dateArray.foreach((dateTime, response) =>{
            getForecast(dateTime, response);
        });
        
    }); 
}

function getUV(lat, lon){
    var uURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
    $.ajax({
        url: uURL,
        method: "GET"
    }).then((response) =>{
        $("#currentCityUV").text(response.value);
        if(response.value < 3.0){
            $("#currentCityUV").attr("class", "greenUV")
        }else if(response.value > 3.0 && response.value < 6.0){
            $("#currentCityUV").attr("class", "yellowUV")    
        }else if(response.value > 6.0 && response.value < 9.0){
            $("#currentCityUV").attr("class", "redUV")    
        }
    });
}
//getWeather();
//$(".sButton").click(getWeather(currentCity))

function addButton(city) {
    $("#searchHistory").prepend("<div class='row'><div class='col'><button type=\"button\" class=\"btn btn-outline-info city-btn\" id=\"citySearch\">" + city + "</button></div></div>");
}

function searchCity(city) {
    if (city === null || city === '') {
        return;
    }
    //currentCity = city;
    $(".hide").removeClass("hide");
    getWeather(city);
}



