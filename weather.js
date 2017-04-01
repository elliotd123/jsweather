var apiKey = '';

function update(response) 
{
	js = JSON.parse(response);
	console.log(js);
	
	var curCity = document.getElementsByClassName("c_city");
	var curCountry = document.getElementsByClassName("c_country");	
	var curTemp = document.getElementsByClassName("c_temp");	
	var curCondition = document.getElementsByClassName("c_condition");	
	var curIcon = document.getElementsByClassName("c_icon");	
	
	for (i = 0; i < curCity.length; i++)
	{
		curCity[i].innerHTML = js.name;
	}
	
	for (i = 0; i < curCountry.length; i++) 
	{
		curCountry[i].innerHTML = js.sys.country;
	}
	
	for (i = 0; i < curTemp.length; i++)
	{
		curTemp[i].innerHTML = js.main.temp + "F";
	}
	
	condition = js.weather[0].main + ' - ' + js.weather[0].description;
	for (i = 0; i < curCondition.length; i++)
	{
		curCondition[i].innerHTML = condition;
	}
	
	iconSrc = "http://openweathermap.org/img/w/" + js.weather[0].icon + ".png";
	for (i = 0; i < curIcon.length; i++)
	{
		curIcon[i].src = iconSrc;
	}
}

function updateForecast(response)
{
	js = JSON.parse(response);
	
	var timeAreas = document.getElementsByClassName("f_time");
	var tempAreas = document.getElementsByClassName("f_temp");
	var weatherAreas = document.getElementsByClassName("f_weather"); 
	
	for (i = 0; i < timeAreas.length; i++) 
	{
		var time = new Date(js.list[i].dt * 1000);
		timeAreas[i].innerHTML = time;
	}
	
	for (i = 0; i < tempAreas.length; i++)
	{
		var temp = js.list[i].main.temp;
		tempAreas[i].innerHTML = temp + "F";
	}
	for (i = 0; i < weatherAreas.length; i++)
	{
		var weather = js.list[i].weather[0].description;
		weatherAreas[i].innerHTML = weather;
	}
	
}

function httpGetAsync(theUrl, callback)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() { 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.responseText);
			else if (xmlHttp.readyState == 4 & xmlHttp.status == 401)
			{
				console.log("Bad API key");
				getApiKey();
			}
	}
	xmlHttp.open("GET", theUrl, true); // true for asynchronous 
	xmlHttp.send(null);
}

function getWeather()
{
	var city = document.getElementById('city').value;
	if (city == "") {
		city = "Cedar Rapids";
	}
	city = city.replace(/ /, '%20');
	query = "q=" + city;
	zip = parseInt(city);
	if (! isNaN(zip))
	{
		query = "zip=" + city;
	}
	
	console.log("Using key: " + apiKey);
	httpGetAsync("http://api.openweathermap.org/data/2.5/weather?units=Imperial&" + query + "&appid=" + apiKey,update);
	httpGetAsync("http://api.openweathermap.org/data/2.5/forecast?units=Imperial&" + query + "&appid=" + apiKey,updateForecast);
}
function getApiKey()
{
	var apiInput = window.prompt('OpenWeatherMap API Key','');
	apiKey = apiInput;
	document.cookie = 'apiKey=' + apiKey + '; expires=Tue, 19 Jan 2038 03:14:07 UTC';
}

document.getElementById('city').onkeypress = function(e)
{
	if (e.keyCode == 13)
	{
		document.getElementById('goButton').click();
	}
}

var cookies = document.cookie.split(';');
for (i = 0; i < cookies.length; i++)
{
	var cookieKey = cookies[i].split('=')[0];
	var cookieValue = cookies[i].split('=')[1];
	
	if (cookieKey == 'apiKey')
	apiKey = cookieValue;
}

if (apiKey == '' || apiKey == 'null')
{
	getApiKey();
}

if (apiKey != '' && apiKey != 'null') {
	getWeather();
}
