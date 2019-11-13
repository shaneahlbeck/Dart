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
var selectMeasuresite;
var optionMeasuresites;
var submitButton;
var measureParameters;
var selectedMeasureParameter;
var selectedMeasureSite;
var startDate;
var endDate;

// Table: Current data
var currValTableBody;
var tr;

// Table: Historical data
var histTable;
var histTableBody;
var histCaption;
var thMeasureparameter;
var newDateFormat;
var faultMessage;


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
function getHistData(url) {

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myRes2) {
            resHis = myRes2;
            renderHistData();
        })
        .catch(function (e) {
            console.error(e);
        })
}

// Render Function 
function render() {

    // Create Option-element for Each Measuresite
    for (var i = 0; i < res.length; i++) {
        optionMeasuresites = document.createElement("option");
        optionMeasuresites.innerHTML = res[i].Code;
        selectMeasuresite.appendChild(optionMeasuresites);
    }

    // Set Maximum Date in Formular to Today's Date
    startDate.max = new Date().toISOString().split("T")[0];
    endDate.max = new Date().toISOString().split("T")[0];

    //Create Table
    res.forEach((row) => {

        // If Value is Undefined
        if (row.MeasureParameters[0].CurrentValue == undefined) {
            row.MeasureParameters[0].CurrentValue = "-";
        }
        if (row.DG == undefined) {
            row.DG = "-";
        }
        if (row.SG == undefined) {
            row.SG = "-";
        }

        // Create Simple Grade (normal, high, low)
        if (row.MeasureParameters[0].CurrentValue < row.SG) {
            var grade = "LÅGT";
        } else if (row.MeasureParameters[0].CurrentValue > row.DG) {
            var grade = "HÖGT";
        } else {
            var grade = "&#10003;";
        }

        // Main Table Content
        tr = document.createElement("tr");
        tr.innerHTML = "<td>" + row.Description + "</td>" + "<td>" + row.MeasureParameters[0].CurrentValue + "</td>" + "<td>" + row.DG + "</td>" + "<td>" + row.SG + "</td>" + "<td>" + grade + "</td>";
        currValTableBody.appendChild(tr);
    });


    // Create Map Markers
    for (var i = 0; i < res.length; i++) {
        lats.push(res[i].Lat)
        longs.push(res[i].Long);
    }

    //Submit Form ()
    submitButton.addEventListener('click', function (e) {

        e.preventDefault();

        // Create URL2
        var selectedIdx = selectMeasuresite.selectedIndex;
        var selectedOpt = selectMeasuresite.options;

        for (var i = 0; i < measureParameters.length; i++) {
            if (measureParameters[i].checked) {
                selectedMeasureParameter = measureParameters[i].value;
            }
        }

        selectedMeasureSite = selectedOpt[selectedIdx].text;
        url2 = 'http://data.goteborg.se/RiverService/v1.1/Measurements/f7a16e1a-1f8f-44f7-9230-54bdc02ac2ba';
        url2 += "/" + selectedOpt[selectedIdx].text + "/" + selectedMeasureParameter + "/" + startDate.value + "/" + endDate.value + '?format=json&limit=10';

        // getHistData(url2)
        getHistData(url2)
    });
}


// Render Historical Data
function renderHistData() {

    // Change from Code Name to Description Name (make a better solution later!)
    if (selectedMeasureSite == "Arketjarn") {
        histCaption.innerHTML = "Arketjärn";
    } else if (selectedMeasureSite == "Garda") {
        histCaption.innerHTML = "Gårda dämme";
    } else if (selectedMeasureSite == "Harsjo") {
        histCaption.innerHTML = "Härsjö dämme";
    } else if (selectedMeasureSite == "Kalleredsbacken") {
        histCaption.innerHTML = "Kålleredsbäcken";
    } else if (selectedMeasureSite == "Landvetter") {
        histCaption.innerHTML = "Landvettersjöns dämme";
    } else if (selectedMeasureSite == "Levgrensvagen") {
        histCaption.innerHTML = "Levgrensvägen";
    } else if (selectedMeasureSite == "Larjean") {
        histCaption.innerHTML = "Lärjeholm";
    } else if (selectedMeasureSite == "MolndalCentrum") {
        histCaption.innerHTML = "Mölndal C";
    } else if (selectedMeasureSite == "Nedsjon") {
        histCaption.innerHTML = "Nedsjöns dämme";
    } else if (selectedMeasureSite == "Rada") {
        histCaption.innerHTML = "Rådasjön";
    } else if (selectedMeasureSite == "Skars led") {
        histCaption.innerHTML = "Skårs led";
    } else if (selectedMeasureSite == "Stensjon") {
        histCaption.innerHTML = "Stensjö dämme";
    } else {
        histCaption.innerHTML = selectedMeasureSite;
    }

    // Create Table Header Column After Chosen Measure Parameter
    if (selectedMeasureParameter == "Level") {
        thMeasureparameter.innerHTML = "Vattennivå <br> (m, RH2000)";
    } else if (selectedMeasureParameter == "Tapping") {
        thMeasureparameter.innerHTML = "Tappning <br> (m, RH2000)";
    } else if (selectedMeasureParameter == "RainFall") {
        thMeasureparameter.innerHTML = "Nederbörd <br> (mm/h)";
    } else if (selectedMeasureParameter == "LevelDownstream") {
        thMeasureparameter.innerHTML = "Nivå nedströms <br> (m, RH2000)";
    } else if (selectedMeasureParameter == "Flow") {
        thMeasureparameter.innerHTML = "Flöde <br>(m<sup>3</sup>/s)";
    }

    // Start with No Table Content
    histTableBody.innerHTML = null;

    // Create Table Content
    resHis.forEach((row) => {

        // Change Date Format
        newDateFormat = new Date(parseInt(row.TimeStamp.slice(6, -7))).toLocaleDateString();

        // Table Content
        tr = document.createElement("tr");
        tr.innerHTML = "<td>" + newDateFormat + "</td>" + "<td>" + row.Value + "</td>";
        histTableBody.appendChild(tr);
    });

    // Display Fault Message if No Aviable Data
    if (histTableBody.innerHTML == "") {
        histTable.style.display = "none";
        faultMessage.style.display = "block";
        faultMessage.innerHTML = "<h4>Ingen tillgänglig data</h4><p>Det finns ingen data att visa för valda datum för angiven mätparameter och mätplats. Vänligen försök igen med nya datum alternativt ändra din mätparameter eller mätplats.</p>";
    } else {
        faultMessage.style.display = "none";
        histTable.style.display = "table";
    }
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

    // Add Markers
    for (var i = 0; i < lats.length; i++)
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(lats[i], longs[i]),
            map: map
        });
}

// EVENT DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {

    // Dom Variables
    selectMeasuresite = document.getElementById("select-measuresite");
    submitButton = document.getElementById("submit-button");
    measureParameters = document.getElementsByName("measureparameter");
    currValTableBody = document.querySelector("#curr-value-table > tbody");
    startDate = document.getElementById("start-date");
    endDate = document.getElementById("end-date");
    histTable = document.getElementById("hist-value-table");
    histTableBody = document.getElementById("t-body");
    histCaption = document.getElementById("hist-caption");
    faultMessage = document.getElementById("fault-message");
    thMeasureparameter = document.getElementById("measureparameter");

    // Hide Historical Data Table
    histTable.style.display = "none";

    // Functions
    getData(url1), initMap();

})