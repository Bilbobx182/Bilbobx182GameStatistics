const d3 = require('d3');

global.heatMapValues = [];
var mousePoints = [];
var keyPressData = [
    {key: "Nothing yet!", value: 10}
];
global.screenDimensions = {width: screen.width, height: screen.height};

init();

function init() {

    for (let y = 0; y < screenDimensions.height / 2; y += 40) {
        for (let x = 0; x < screenDimensions.width / 2; x += 40) {
            heatMapValues.push({
                xLocation: x,
                yLocation: y,
                heatLevel: 0
            })
        }
        x = 0;
    }

    pieChart(keyPressData);
    barChart(keyPressData);
    heatMap();
}

function barChart(keyPressdata) {

    var clearBar = document.getElementById('barChart');
    clearBar.innerHTML = "";


    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

// set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    var svg = d3.select("#barChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Scale the range of the data in the domains
    x.domain(keyPressdata.map(function (d) {
        return d.key;
    }));
    y.domain([0, d3.max(keyPressdata, function (d) {
        return d.value;
    })]);

    // append the rectangles for the bar chart
    svg.selectAll("#barChart")
        .data(keyPressdata)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.key);
        })
        .attr("width", x.bandwidth())
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("height", function (d) {
            return height - y(d.value);
        })
        .attr('fill', (d, i) => color(i))
        .on("mouseover", function (d) {
            d3.select(this)
                .style("cursor", "pointer")
                .style("fill", "white");
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("cursor", "none")
                .style("fill", color(this._current));
        })
        .each(function (d, i) {
            this._current = i;
        });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axisColour")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .attr("class", "axisColour")
        .call(d3.axisLeft(y));

}

function pieChart(keyPressData) {

    var test = document.getElementById('chart');
    test.innerHTML = "";
    var text = "";

    var width = 260;
    var height = 260;
    var thickness = 40;
    var duration = 750;

    var radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select("#chart")
        .append('svg')
        .attr('class', 'pie')
        .attr('width', width)
        .attr('height', height);

    var g = svg.append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    var arc = d3.arc()
        .innerRadius(radius - thickness)
        .outerRadius(radius);

    var pie = d3.pie()
        .value(function (d) {
            return d.value;
        })
        .sort(null);

    var path = g.selectAll('path')
        .data(pie(keyPressData))
        .enter()
        .append("g")
        .on("mouseover", function (d) {
            let g = d3.select(this)
                .style("cursor", "pointer")
                .style("fill", "black")
                .append("g")
                .attr("class", "text-group");

            g.append("text")
                .attr("class", "name-text")
                .text(`${d.data.key}`)
                .attr('text-anchor', 'middle')
                .attr('dy', '-1.2em');

            g.append("text")
                .attr("class", "value-text")
                .text(`${d.data.value}`)
                .attr('text-anchor', 'middle')
                .attr('dy', '.6em');
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("cursor", "none")
                .style("fill", color(this._current))
                .select(".text-group").remove();
        })
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i))
        .on("mouseover", function (d) {
            d3.select(this)
                .style("cursor", "pointer")
                .style("fill", "white");
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("cursor", "none")
                .style("fill", color(this._current));
        })
        .each(function (d, i) {
            this._current = i;
        });


    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .text(text);
}

function heatMap() {

    var test = document.getElementById('mouseMovements');
    test.innerHTML = "";


    var colorDomain = d3.extent(heatMapValues, function (d) {
        return d.heatLevel;
    });
    var colorScale = d3.scaleOrdinal()
        .domain(colorDomain)
        .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
            "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);


    var svg = d3.select("#mouseMovements")
        .append("svg")
        .attr("width", screenDimensions.width / 2)
        .attr("height", screenDimensions.height / 2);


    var rectangles = svg.selectAll("rect")
        .data(heatMapValues)
        .enter()
        .append("rect");

    rectangles
        .attr("x", function (d) {
            return d.yLocation;
        })
        .attr("y", function (d) {
            return d.xLocation;
        })
        .attr("width", 40)
        .attr("height", 40).style("fill", function (d) {
        return colorScale(d.heatLevel);
    });
}

require('electron').ipcRenderer.on('ping', (event, message) => {
    pieChart(message);
    barChart(message);
});

function convertRange(value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}

require('electron').ipcRenderer.on('mouseMove', (event, message) => {
    let xLocation = Math.floor(convertRange(message.x, [0, screenDimensions.width], [0, screenDimensions.width / 2]));
    let yLocation = Math.floor(convertRange(message.y, [0, screenDimensions.height], [0, screenDimensions.height / 2]));

    mousePoints.push(xLocation);
    mousePoints.push(yLocation);

    objIndex = heatMapValues.findIndex((obj => obj.xLocation ==Math.round(xLocation / 40) * 40  && obj.yLocation ==Math.round(xLocation / 40) * yLocation));

    console.log(objIndex);

    if(objIndex >= 0) {
        heatMapValues[objIndex].heatLevel += 1;
    }

    heatMap();
});

function artsyMouseMovements(event) {
    var clearBar = document.getElementById('mouseMovements');
    clearBar.innerHTML = "";


    var svg = d3.select("#mouseMovements").append("svg")
        .attr("width", screenDimensions.width / 2)
        .attr("height", screenDimensions.height / 2 - 50);

    svg.append('rect')
        .attr("x", 1)
        .attr("y", 1)
        .attr("width", screenDimensions.width / 2)
        .attr("height", screenDimensions.height / 2)
        .attr("fill", d3.rgb('#323439'));

    if (mousePoints.length > 0)
        svg.append("polyline")
            .style("fill", "aliceblue")
            .attr("points", mousePoints);
}

function mouseMovements(event) {
    var clearBar = document.getElementById('mouseMovements');
    clearBar.innerHTML = "";


    var svg = d3.select("#mouseMovements").append("svg")
        .attr("width", screenDimensions.width / 2)
        .attr("height", screenDimensions.height / 2 - 50);

    svg.append('rect')
        .attr("x", 1)
        .attr("y", 1)
        .attr("width", screenDimensions.width / 2)
        .attr("height", screenDimensions.height / 2)
        .attr("fill", d3.rgb('#323439'));

    if (mousePoints.length > 0)
        svg.append("polyline")
            .style("stroke", "aliceblue")
            .attr("points", mousePoints)
            .attr("fill", d3.rgb('#323439'));
}