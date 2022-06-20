const myLocations = [];
let checkedLocation = null;
let checkedLocationName = null;
let speedUnit = null;
let tempUnit = null;

 

function scrolldivpizdunia() {
    var elem = document.getElementById("settingsContainer");
    elem.scrollIntoView({behavior: 'smooth', block: 'start'});
    document.getElementById("sidenavView").style.height = "100vh";
}

function startingSetup() {
    if (myLocations.length === 0) {
        openSettings();
        metricUnits();
    } else {
        checkedLocation = myLocations[0]["Locc Id"];
        currentConditions();
    }
}

function metricUnits() {
    speedUnit = "KMH";
    localStorage.setItem("presetSpeedUnit", speedUnit);
    console.log(speedUnit)
    tempUnit = "C";
    localStorage.setItem("presetTempUnit", tempUnit);
}

function imperialUnits() {
    speedUnit = "MPH";
    localStorage.setItem("presetSpeedUnit", speedUnit);
    console.log(speedUnit)
    tempUnit = "F";
    localStorage.setItem("presetTempUnit", tempUnit);
}


window.onload = retrieveFromLocalStorage();
window.onload = document.getElementById("searchLocationView").style.display = "none";
window.onload = startingSetup();

function retrieveFromLocalStorage() {

    let retrievedMyLocationsArray = JSON.parse(localStorage.getItem("localMyLocations"));
    let retrievedMyLocations = {};
    console.log(retrievedMyLocationsArray);
    if (retrievedMyLocationsArray !== null) {
        for (let i = 0; i < retrievedMyLocationsArray.length; i++) {
            if (retrievedMyLocationsArray[i] !== null) {
                retrievedMyLocations[i] = retrievedMyLocationsArray[i]

            };
            myLocations.push(retrievedMyLocations[i]);
        };
    }
    showMyLocations();
    speedUnit = localStorage.getItem("presetSpeedUnit");
    tempUnit = localStorage.getItem("presetTempUnit");
    console.log(speedUnit)
}

function addToMyLocations(examinedLocation) {
    console.log(examinedLocation);

    if (myLocations.find(l => l['Locc Id'] === examinedLocation['Locc Id'])) {
        console.log('nay');
        document.getElementById("selectionButton" + examinedLocation['Locc Id']).style.backgroundColor = "darkred";
        document.getElementById("selectionButton" + examinedLocation['Locc Id']).innerText = "Look Up!";

    } else {
        console.log('yay');
        myLocations.push(examinedLocation);
        showMyLocations();
        saveMyLocations();
        // scrolldivpizdunia();
        openLocationsSettings(null, 0);
    };

}

const responsesToNewLocation = [];


function saveMyLocations() {
    for (let i = 0; i < myLocations.length; i++) {
        let myLocationsArrayStringed = JSON.stringify(myLocations);
        console.log(myLocationsArrayStringed);
        localStorage.setItem("localMyLocations", myLocationsArrayStringed);
    }
}

function clearMyLocations() {
    localStorage.clear();
    metricUnits();
    myLocations.length = 0;
    document.getElementById("columnMenuMyLocations").innerHTML = "";
}

function searchQueryLocation() {
    document.getElementById("output").innerHTML = "";
    queriedLocation = document.getElementById("queryLocation").value;
    returnQueryLocation();
}


function returnQueryLocation() {
    let options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'foreca-weather.p.rapidapi.com',
            'X-RapidAPI-Key': '5c7ef54236msh4e77c55f2c97e22p1f7c4djsn167cc81ac7ec'
        }
    };
    fetch('https://foreca-weather.p.rapidapi.com/location/search/' + queriedLocation + '?lang=en', options).then(responseNewLocation => responseNewLocation.json()).then(responseNewLocation => {
        console.log(responseNewLocation.locations)
        let foundLocations = responseNewLocation.locations
        console.log(foundLocations)
        for (let i = 0; i < foundLocations.length; i++) {


            document.getElementById("output").innerHTML += '';

            var outputText = document.createElement('div');
            outputText.type = 'div';
            outputText.innerHTML = '<div class="locationEntryText" id ="output-text" ><div class="locationNameHighlight"><div id="locationName.' + i + '">' + foundLocations[i].name + '</div></div>' + foundLocations[i].country + ' ▴ ' + foundLocations[i].adminArea + '</div></div>';
            if (foundLocations[i].adminArea == null) {
                outputText.innerHTML = outputText.innerHTML.replace(null, "Pretty Place");
            };
            document.getElementById("output").appendChild(outputText);

            var idButton = document.createElement('button');
            idButton.type = 'button';
            idButton.className = "confirmButton addLocationButton";
            idButton.id = "selectionButton" + foundLocations[i].id;
            idButton.innerText = "+";
            idButton.value = foundLocations[i].id;
            idButton.setAttribute("onclick", "addToMyLocations({'Locc Name': document.getElementById('locationName." + i + "').innerText, 'Locc Id': document.getElementById('selectionButton" + foundLocations[i].id + "').value});");
            document.getElementById("output").appendChild(idButton);


        }
    }).catch(err => console.error(err));
}

document.getElementById("queryLocation").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        searchQueryLocation();
    }
});


function showMyLocations() {
    document.getElementById("columnMenuMyLocations").innerHTML = "";

    for (let i = 0; i < myLocations.length; i++) {
        document.getElementById("columnMenuMyLocations").innerHTML += "<br>"
        var menuMyLocationsText = document.createElement('button');
        menuMyLocationsText.type = "button";
        menuMyLocationsText.className = "menuMyLocationsButton";
        menuMyLocationsText.id = "menuMyLocationsText." + [i];
        menuMyLocationsText.value = myLocations[i]["Locc Id"];
        menuMyLocationsText.innerText = myLocations[i]["Locc Name"];
        menuMyLocationsText.setAttribute("onclick", "checkedLocation = document.getElementById('menuMyLocationsText." + i + "').value, currentConditions()");
        document.getElementById("columnMenuMyLocations").appendChild(menuMyLocationsText);

    };


}

function hide(elements) {
    elements = elements.length ? elements : [elements];
    for (var index = 0; index < elements.length; index++) {
        elements[index].style.display = 'none';
    }
}

function show(elements, specifiedDisplay) {
    elements = elements.length ? elements : [elements];
    for (var index = 0; index < elements.length; index++) {
        elements[index].style.display = specifiedDisplay || 'block';
    }
}

function determineSettingsButtonActivity() {
    if (document.getElementById('sidenavView').style.width != "calc(var(--sidenavWidth))") {
        currentConditions()
    } else {
        openSettings()
        
    }
}


function closeSettings() {
    getRidOfSettingsButtons();
    document.getElementById('sidenavView').style.transition = "width 2s ease-in-out";
    document.getElementById('locationsEntriesView').style.transition = "width 2s ease-in-out";
    document.getElementById("mainView").style.visibility = "visible";
    document.getElementById("mainView").style.transition = "visibility 0s linear";
    document.getElementById('mainView').style.transitionDelay = "2.5s";
    document.getElementById("searchLocationView").style.display = "none";
    document.getElementById('sidenavView').style.width = "calc(var(--sidenavWidth))";
    document.getElementById('locationsEntriesView').style.width = "calc(var(--sidenavWidth))";
    saveMyLocations();

}

function openSettings() {
    document.getElementById("mainView").style.visibility = "hidden";
    document.getElementById("mainView").style.transition = "visibility 0s linear";
    document.getElementById('sidenavView').style.width = "99%";
    document.getElementById('locationsEntriesView').style.width = "99%";
    document.getElementById('sidenavView').style.transition = "width 2s ease-in-out";
    document.getElementById('locationsEntriesView').style.transition = "width 2s ease-in-out";
    document.getElementById('sidenavView').style.transitionDelay = "0s";
    document.getElementById('locationsEntriesView').style.transitionDelay = "0s";
    setTimeout(function () {
        document.getElementById("searchLocationView").style.display = "block";
        showLocationSearchPanel();
        // scrolldivpizdunia(); // scroll to arrows and center
    }, 2000);
    setTimeout(function () {
        openLocationsSettings("height 0.5s", 500);
    }, 500);
}


function currentConditions() {
    closeSettings();
    const options2 = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'foreca-weather.p.rapidapi.com',
            'X-RapidAPI-Key': '5c7ef54236msh4e77c55f2c97e22p1f7c4djsn167cc81ac7ec'
        }
    };

    fetch('https://foreca-weather.p.rapidapi.com/current/' + checkedLocation + '?alt=0&tempunit=' + tempUnit + '&windunit=' + speedUnit + '&lang=en', options2).then(currentConditionsResponse => currentConditionsResponse.json()).then(currentConditionsResponse => {

        console.log(currentConditionsResponse);
        show(document.getElementById('checkedLocationNameBar'))
        document.getElementById("currentConditionsWindow").innerHTML = "";
        document.getElementById("currentConditionsWindow").innerHTML += "<div class='currentConditionsTitle'>" + currentConditionsResponse["current"]["symbolPhrase"] + "</div>" + "<div class='temperatureText'>" + currentConditionsResponse["current"]["temperature"] + " °" + tempUnit + "</div>";
        document.body.style.backgroundImage = "url('backgrounds/" + currentConditionsResponse["current"]["symbol"] + ".jpg')";

    }).catch(err => {
        console.error(err)
        document.getElementById("infoSpace").innerHTML = "";
        document.getElementById("infoSpace").innerHTML = "<br>Failed Connection Attempt! <br><img src='icons/error.svg' style='max-height:40vh;max-width:40vw'>";
    });

    myLocations.forEach(o => {
        if (o["Locc Id"] === checkedLocation) {
            console.log(o);
            console.log(o["Locc Name"]);
            checkedLocationName = o["Locc Name"];
        }
        document.getElementById("checkedLocationNameBar").innerHTML = checkedLocationName;
    })
    console.log(checkedLocationName);


    fetch('https://foreca-weather.p.rapidapi.com/forecast/hourly/' + checkedLocation + '?alt=0&tempunit=' + tempUnit + '&windunit=' + speedUnit + '&periods=12&dataset=full&history=0', options2).then(responseHourlyConditions => responseHourlyConditions.json()).then(responseHourlyConditions => {
        console.log(responseHourlyConditions);
        console.log(responseHourlyConditions.forecast.length);
        document.getElementById("next12hTitle").innerHTML = "";
        document.getElementById("next12hTitle").innerHTML = "Next 12 h";
        document.getElementById("hourlyForecastSection").innerHTML = "";
        for (var i = 0; i < responseHourlyConditions.forecast.length; i++) {
            let timeSeparated = responseHourlyConditions["forecast"][i].time.split(/[T:]+/);
            document.getElementById("hourlyForecastSection").innerHTML += "<div class='hourly timehour'>" + timeSeparated[1] + "h </div>" + " <center><div id='symbol" + [i] + "' class='symbolhr'></div></center><div class='hourly timetemp'>" + responseHourlyConditions["forecast"][i].temperature + "°" + tempUnit + "</div>";
            document.getElementById("symbol" + [i]).style.backgroundImage = "url('icons/" + responseHourlyConditions['forecast'][i].symbol + ".svg')";
        }
    }).catch(err => console.error(err));

    fetch('https://foreca-weather.p.rapidapi.com/current/' + checkedLocation + '?alt=0&tempunit=' + tempUnit + '&windunit=' + speedUnit + '&lang=en', options2).then(currentDetails => currentDetails.json()).then(currentDetails => {
        console.log(currentDetails);
        document.getElementById("detailsTitle").innerHTML = "";
        document.getElementById("detailsTitle").innerHTML = "Details";
        let pressureValue = currentDetails.current.pressure.toString();
        document.getElementById("detailedCurrentSection").innerHTML = "";
        let pressureSeparated = pressureValue.split(/[.]/);
        let visibilityRecalculated = undefined
            if (speedUnit != "KMH") {
                 visibilityRecalculated = Math.round((currentDetails.current.visibility / 1000) / 1.60934) + " mi"
             } else {
                visibilityRecalculated = Math.round(currentDetails.current.visibility / 1000) + " km"   
             }
        document.getElementById("detailedCurrentSection").innerHTML = "<div class='detailCard majorFont'>Feels Like:<br><div class='detailMajor bolderFont'>" + currentDetails.current.feelsLikeTemp + "°" + tempUnit + "</div></div><br>" + "<div class='detailCard majorFont'>Probability:<br><div class='detailMajor bolderFont'>" + currentDetails.current.precipProb + "%</div></div><br>" + "<div class='detailCard majorFont'>Wind Speed:<br><div class='detailMajor bolderFont' style='text-transform:lowercase'>" + currentDetails.current.windSpeed + " " + speedUnit + "</div></div><br>" + "<div class='detailCard majorFont'>Pressure:<br><div class='detailMajor bolderFont'>" + pressureSeparated[0] + "hPa</div></div><br>" + "<div class='detailCard majorFont'>Humidity:<br><div class='detailMajor bolderFont'>" + currentDetails.current.relHumidity + "%</div></div><br>" + "<div class='detailCard majorFont'>Dew Point:<br><div class='detailMajor bolderFont'>" + currentDetails.current.dewPoint + "°" + tempUnit + "</div></div><br>" + "<div class='detailCard majorFont'>Visibility:<br><div class='detailMajor bolderFont'>" + visibilityRecalculated + "</div></div><br>" + "<div class='detailCard majorFont'>UV Index:<br><div class='detailMajor bolderFont'>" + currentDetails.current.uvIndex + "</div></div><br>";

    }).catch(err => {
        console.error(err)
        document.getElementById("detailsTitle").innerHTML = ""
    });

    fetch('https://foreca-weather.p.rapidapi.com/forecast/daily/' + checkedLocation + '?alt=0&tempunit=' + tempUnit + '&windunit=' + speedUnit + '&periods=8&dataset=full', options2).then(dailyForecast => dailyForecast.json()).then(dailyForecast => {
        console.log(dailyForecast);
        document.getElementById("upcomingTitle").innerHTML = "";
        document.getElementById("dailyForecastSection").innerHTML = "";
        document.getElementById("upcomingTitle").innerHTML = "A Look Ahead";
        for (var i = 0; i < dailyForecast.forecast.length; i++) {
            let dateString = dailyForecast['forecast'][i]['date'].toString();
            let dateSeparated = dateString.split(/[-]/);
            // console.log(dateSeparated);
            let dateStandardised = new Date(Date.UTC(dateSeparated[0], (dateSeparated[1] - 1), dateSeparated[2]));
            // console.log(dateStandardised);
            const daysOfWeek = [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat"
            ]
            let dayOfWeek = daysOfWeek[dateStandardised.getDay()];
            document.getElementById("dailyForecastSection").innerHTML += "<table><tr><td class='dailyForecastDay majorFont' style='width:35%'>" + dayOfWeek + "</td><td><div id='symbolday" + [i] + "' class='symbolhr'></div></td><td class='dailyForecastLow mediumFont'>L: <br>" + dailyForecast['forecast'][i]['minTemp'] + "°" + tempUnit + "</td><td class='dailyForecastHigh mediumFont'>H: <br>" + dailyForecast['forecast'][i]['maxTemp'] + "°" + tempUnit + "</td></tr></table>";
            document.getElementById("symbolday" + [i]).style.backgroundImage = "url('icons/" + dailyForecast['forecast'][i].symbol + ".svg')";
            document.getElementById("tempAmplitudeBar").innerHTML = "<div id='highTempAmp'>H: " + dailyForecast['forecast'][0]['maxTemp'] + "°" + tempUnit + "</div>" + "<div id='lowTempAmp'>L: " + dailyForecast['forecast'][0]['minTemp'] + "°" + tempUnit + "</div>";
        }
    }).catch(err => {
        console.error(err)
        document.getElementById("upcomingTitle").innerHTML = ""
    });
};


function openLocationsSettings(transitionEffect, timeOutValue) {
    for (let i = 0; i < myLocations.length; i++) {
        var allMyLocationsButtonsIdentifiers = document.getElementsByClassName("menuMyLocationsButton")[i]["id"];
        var allMyLocationsButtonsValues = document.getElementsByClassName("menuMyLocationsButton")[i]["value"];
        console.log(allMyLocationsButtonsIdentifiers);
        console.log(allMyLocationsButtonsValues);
        let parentDiv = document.getElementById(allMyLocationsButtonsIdentifiers).parentNode;
        arrayButtonIdentifiers = document.getElementById(allMyLocationsButtonsIdentifiers)
        console.log(parentDiv);


        // move up buttons
        var allMyLocationsButtonsMoveUp = document.createElement('div');
            allMyLocationsButtonsMoveUp.id = "moveUpButton" + allMyLocationsButtonsValues;
            allMyLocationsButtonsMoveUp.type = "div";
            allMyLocationsButtonsMoveUp.className = "settingsButtonType";
            allMyLocationsButtonsMoveUp.setAttribute("href", "#");
            allMyLocationsButtonsMoveUp.setAttribute("onclick", "moveUpLocation(" + allMyLocationsButtonsValues + ")");
            allMyLocationsButtonsMoveUp.style.backgroundImage = "url('icons/up-icon.svg')";
            allMyLocationsButtonsMoveUp.style.padding = "0";
            allMyLocationsButtonsMoveUp.style.height = "0";
            allMyLocationsButtonsMoveUp.style.width = "0";
            // allMyLocationsButtonsMoveUp.style.fontSize = "0";
            // allMyLocationsButtonsMoveUp.style.visibility = "hidden";
        

        // delete buttons
        var allMyLocationsButtonsDelete = document.createElement('div');
            allMyLocationsButtonsDelete.id = "deletionButton" + allMyLocationsButtonsValues;
            allMyLocationsButtonsDelete.type = "div";
            allMyLocationsButtonsDelete.className = "settingsButtonType";
            allMyLocationsButtonsDelete.setAttribute("href", "#");
            allMyLocationsButtonsDelete.setAttribute("onclick", "deleteLocation(" + allMyLocationsButtonsValues + ")");
            allMyLocationsButtonsDelete.style.backgroundImage = "url('icons/close-icon.svg')";
            allMyLocationsButtonsDelete.style.padding = "0";
            allMyLocationsButtonsDelete.style.height = "0";
            allMyLocationsButtonsDelete.style.width = "0";
            // allMyLocationsButtonsDelete.style.fontSize = "0";
            // allMyLocationsButtonsDelete.style.visibility = "hidden";

        // move down buttons 
        var allMyLocationsButtonsMoveDown = document.createElement('div');
            allMyLocationsButtonsMoveDown.id = "moveDownButton" + allMyLocationsButtonsValues;
            allMyLocationsButtonsMoveDown.type = "div";
            allMyLocationsButtonsMoveDown.className = "settingsButtonType";
            allMyLocationsButtonsMoveDown.setAttribute("href", "#");
            allMyLocationsButtonsMoveDown.setAttribute("onclick", "moveDownLocation(" + allMyLocationsButtonsValues + ")");
            allMyLocationsButtonsMoveDown.style.backgroundImage = "url('icons/down-icon.svg')";
            allMyLocationsButtonsMoveDown.style.padding = "0";
            allMyLocationsButtonsMoveDown.style.height = "0";
            allMyLocationsButtonsMoveDown.style.width = "0";
            // allMyLocationsButtonsMoveDown.style.fontSize = "0";
            // allMyLocationsButtonsMoveDown.style.visibility = "hidden";

        parentDiv.insertBefore(allMyLocationsButtonsMoveDown, arrayButtonIdentifiers);
        parentDiv.insertBefore(allMyLocationsButtonsMoveUp, allMyLocationsButtonsMoveDown);
        parentDiv.insertBefore(allMyLocationsButtonsDelete, allMyLocationsButtonsMoveUp);

        setTimeout(function () {
            for (let i = 0; i < document.getElementsByClassName('settingsButtonType').length; i++) {
            document.getElementsByClassName('settingsButtonType')[i].style.transition = transitionEffect;
            document.getElementsByClassName('settingsButtonType')[i].className = "settingsButtonType noMargin";
            }

        }, timeOutValue);

    }
};


// like it works but prevents from being executed the second time
function getRidOfSettingsButtons() {

    try {

        for (let i = 0; i < myLocations.length; i++) {
            var deleteButton1 = document.getElementById("deletionButton" + myLocations[i]["Locc Id"]);
            var deleteButton2 = document.getElementById("moveUpButton" + myLocations[i]["Locc Id"]);
            var deleteButton3 = document.getElementById("moveDownButton" + myLocations[i]["Locc Id"]);
            deleteButton1.remove();
            deleteButton2.remove();
            deleteButton3.remove();
        }

    } catch (err) {}

}


function deleteLocation(locationToDelete) {
    myLocations.forEach(o => {
        if (o["Locc Id"] == locationToDelete) {
            locationToDeleteObject = (o);
        }
    })
    var locationToDeleteIndex = myLocations.indexOf(locationToDeleteObject);

    console.log(locationToDeleteIndex)
    var element = myLocations[locationToDeleteIndex];
    myLocations.splice(locationToDeleteIndex, 1);
    myLocations.splice((myLocations.length + 1), 0, element);
    myLocations.pop()
    saveMyLocations();
    showMyLocations();
    openLocationsSettings(null, 0);

    if (myLocations.length == 0) {
        clearMyLocations();
    };

    document.getElementById("output").innerHTML = " ";
};


function moveUpLocation(locationToMoveUp) {
    myLocations.forEach(o => {
        if (o["Locc Id"] == locationToMoveUp) {
            locationToMoveUpObject = (o);
        }
    })
    var locationToMoveUpIndex = myLocations.indexOf(locationToMoveUpObject);

    console.log(locationToMoveUpIndex)
    var element = myLocations[locationToMoveUpIndex];
    if (locationToMoveUpIndex != 0) {
        myLocations.splice(locationToMoveUpIndex, 1);
        myLocations.splice((locationToMoveUpIndex - 1), 0, element);
        console.log(myLocations);
        saveMyLocations();
        showMyLocations();
        openLocationsSettings(null, 0);
        // openSettings();

        if (myLocations.length == 0) {
            clearMyLocations();
        }
    }
};

function moveDownLocation(locationToMoveDown) {
    myLocations.forEach(o => {
        if (o["Locc Id"] == locationToMoveDown) {
            locationToMoveDownObject = (o);
        }
    })
    var locationToMoveDownIndex = myLocations.indexOf(locationToMoveDownObject);

    console.log(locationToMoveDownIndex)
    var element = myLocations[locationToMoveDownIndex];
    if (locationToMoveDownIndex != myLocations.length) {
        myLocations.splice(locationToMoveDownIndex, 1);
        myLocations.splice((locationToMoveDownIndex + 1), 0, element);
        console.log(myLocations);
        saveMyLocations();
        showMyLocations();
        // openSettings();
        openLocationsSettings(null, 0);

        if (myLocations.length == 0) {
            clearMyLocations();
        }
    }
};

function showLocationSearchPanel() {
    document.getElementById("settingsSearch").style.display = "none";
    document.getElementById("settingsAllSettings").style.display = "none";
    document.getElementById("settingsDataSources").style.display = "none";
    document.getElementById("settingsSearch").style.display = "block";
}

function showSettingsPanel() {
    document.getElementById("settingsSearch").style.display = "none";
    document.getElementById("settingsAllSettings").style.display = "none";
    document.getElementById("settingsDataSources").style.display = "none";
    document.getElementById("settingsAllSettings").style.display = "block";
}

function showDataSourcesPanel() {
    document.getElementById("settingsSearch").style.display = "none";
    document.getElementById("settingsAllSettings").style.display = "none";
    document.getElementById("settingsDataSources").style.display = "none";
    document.getElementById("settingsDataSources").style.display = "block";
}