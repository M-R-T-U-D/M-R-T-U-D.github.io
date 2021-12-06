var municipalitiesJson;
var covidCumulative;
var provinceJson;

Promise.all([
    d3.json("../data/municipalities.geojson"),
    d3.json("../data/province.geojson"),
    d3.dsv(";", "../data/COVID-19_aantallen_gemeente_cumulatief.csv")
]).then(function(allData) {
    // ASSIGN VARS TO CORRESPONDING DATA.
    municipalitiesJson = allData[0];
    provinceJson = allData[1];
    covidCumulative = allData[2];

    document.getElementById("selectedDate").min = formatDate(new Date(covidCumulative[0].Date_of_report));
    document.getElementById("selectedDate").max = formatDate(new Date(covidCumulative[covidCumulative.length - 1].Date_of_report));

    // Data for selected date
    const data = municipalityCheck();

    // CALL FUNCTION TO DRAW THE MAP
    drawMap(data);
    drawHorizontalBarChart(data);
});
