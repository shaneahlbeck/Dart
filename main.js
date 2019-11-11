
//VARIABLES
// Respons
var res;
var url1 = 'http://data.goteborg.se/RiverService/v1.1/MeasureSites/f7a16e1a-1f8f-44f7-9230-54bdc02ac2ba?format=json&limit=10';


// Respons (historical data)
var resHis;
var url2 = 'http://data.goteborg.se/RiverService/v1.1/Measurements/f7a16e1a-1f8f-44f7-9230-54bdc02ac2ba'; // + '/Harsjo' + '/Level' + '/2019-09-01' + '/2019-10-10' + '?format=json&limit=10';


// Map 
var lats = [];
var longs = [];
var marker;

// Form
var mainForm;
var selectMeasuresite;
var optionMeasuresites;
var submitButton;
var measureParameters;
var selectedMeasureParameter;
var selectedMeasureSite;
var startDate;
var endDate;

// Historical data
var historicalData;

// Table
var firstTableBody;
var tr;

// Get Data with Fetch 
function getData(url) {

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myRes) {
            res = myRes;
            render();
        });
}

// Get Historical Data with Fetch 
function getHistoricalData(url) {

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myRes2) {
            resHis = myRes2;
            renderHistData();
        });
}

// Render Function
function render() {
    //console.log(JSON.stringify(res));

    // Create Option-element for each Measuresite
    for (var i = 0; i < res.length; i++) {

        optionMeasuresites = document.createElement("option");
        optionMeasuresites.innerHTML = res[i].Code;
        selectMeasuresite.appendChild(optionMeasuresites);
    }

    //Create Table
    res.forEach((row) => {

        // If Undefined
        if (row.MeasureParameters[0].CurrentValue == undefined) {
            row.MeasureParameters[0].CurrentValue = "-";
        }
        if (row.DG == undefined) {
            row.DG = "-";
        }
        if (row.SG == undefined) {
            row.SG = "-";
        }

        // Grade (normal, high, low)
        if (row.MeasureParameters[0].CurrentValue < row.SG) {
            var grade = "LÅGT";
        } else if (row.MeasureParameters[0].CurrentValue > row.DG) {
            var grade = "HÖGT";
        } else {
            var grade = "&#10003;";
        }

        // Table Content
        tr = document.createElement("tr");
        tr.innerHTML = "<td>" + row.Description + "</td>" + "<td>" + row.MeasureParameters[0].CurrentValue + "</td>" + "<td>" + row.DG + "</td>" + "<td>" + row.SG + "</td>" + "<td>" + grade + "</td>";
        firstTableBody.appendChild(tr);
    });


    // Create Map Markers
    for (var i = 0; i < res.length; i++) {
        lats.push(res[i].Lat)
        longs.push(res[i].Long);
    }
        
        //Submit Form
        submitButton.addEventListener('click', function (e) {

            e.preventDefault();
    
            var selectedIdx = selectMeasuresite.selectedIndex;
            var selectedOpt = selectMeasuresite.options;
            //alert(selectedOpt[selectedIdx].text);
    
            for (var i = 0; i < measureParameters.length; i++) {
                if (measureParameters[i].checked) {
                    selectedMeasureParameter = measureParameters[i].value
                    //alert(selectedMeasureParameter);
                }
            }
            //alert(startDate.value);
            //alert(endDate.value);
    
            url2 += "/" + selectedOpt[selectedIdx].text + "/" + selectedMeasureParameter + "/" + startDate.value + "/" + endDate.value + '?format=json&limit=10';
            getHistoricalData(url2)
    
        });

}


// Render Historical Data
function renderHistData() {
    alert("Hello");
    historicalData.innerHTML ="HEJ";
}


// Init Map 
function initMap() {

    var lats = [57.7898, 57.66263, 57.6966, 57.707757, 57.70838, 57.609903, 57.661713, 57.70442, 57.765768, 57.656882, 57.705738, 57.658897, 57.687418, 57.707466, 57.655437, 57.7231, 57.68455];
    var longs = [12.0101, 12.1335, 11.9088, 11.989718, 12.321005, 12.042376, 12.13231, 11.990405, 12.005462, 12.017133, 12.436992, 12.093324, 11.997993, 11.974832, 12.041699, 11.9869, 11.790725];
    var location = new google.maps.LatLng(57.708870, 11.974560) //{lat: 57.708870, lng: 11.974560}; 

    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: location
    });

    // AddMarkers
    for (var i = 0; i < lats.length; i++)
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(lats[i], longs[i]),
            map: map
        });
}

// VARIABLES




// EVENT
document.addEventListener("DOMContentLoaded", function () {

    // Dom Variables
    mainForm = document.getElementById("main-form");
    selectMeasuresite = document.getElementById("select-measuresite");
    submitButton = document.getElementById("submit-button");
    measureParameters = document.getElementsByName("measureparameter");
    startDate = document.getElementById("start-date");
    endDate = document.getElementById("end-date");

    // Historical data
    historicalData = document.getElementById("historical-data");

    // Table
    firstTableBody = document.querySelector("#curr-value-table > tbody");
    tr;

    getData(url1), initMap();

})
