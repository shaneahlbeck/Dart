var res;
var selectMeasuresite = document.getElementById("select-measuresite");
var optionMeasuresites;

fetch('http://data.goteborg.se/RiverService/v1.1/MeasureSites/f7a16e1a-1f8f-44f7-9230-54bdc02ac2ba?format=json&limit=10')
.then(function(response) {
return response.json();
})
.then(function(myRes) {
    res = myRes;
    render();
});

function render() {
    console.log(JSON.stringify(res));
    for (var i = 0; i < res.length; i++ ){
        optionMeasuresites = document.createElement("option");
        optionMeasuresites.innerHTML = res[i].Code;
        selectMeasuresite.appendChild(optionMeasuresites);
    }
}
