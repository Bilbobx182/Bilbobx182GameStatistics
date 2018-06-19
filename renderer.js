// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const d3 = require('d3');

var keyPressData = [
    {key: "Nothing yet!", value: 10}
];

var GridValues = [
    {xMin: 0, xMax: 26, yMin: 0}
];

pieChart(keyPressData);
barChart(keyPressData);
heatMap();

function calculateHeatMapGrid() {


    return
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
    // COMPUTATIONALLY EXPENSIVE MAKE NICE PLZ

    var screenDimensions = {width: screen.width, height: screen.height};


    var widthCiaran = screenDimensions.width - (.50 * screenDimensions.width);

    function gridData() {
        var data = new Array();
        var xpos = 1;
        var ypos = 1;
        var width = 24;
        var height = 23;
        var click = 0;


        /*
        Figure out how to do it right you're not happy with the height variable
        22 boxes DOWN 40 across

        Maybe do it another time and actually get the thing done anyway.

         */
        // iterate for rows

        //ROW = Y
        for (var row = 0; row < screenDimensions.height * .45; row++) {
            data.push(new Array());

            // iterate for cells/columns inside rows
            for (var column = 0; column < screenDimensions.width / 40; column++) {
                data[row].push({
                    x: xpos,
                    y: ypos,
                    width: width,
                    height: height,
                    click: click
                })
                xpos += width;
            }
            xpos = 1;
            ypos += height;
        }
        return data;
    }

    var gridData = gridData();

    var grid = d3.select("#heatMap")
        .append("svg")
        .attr("width", widthCiaran)
        .attr("height", screenDimensions.height * .45);

    var row = grid.selectAll(".row")
        .data(gridData)
        .enter().append("g")
        .attr("class", "row");

    var column = row.selectAll(".square")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("class", "square")
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d) {
            return d.y;
        })
        .attr("width", function (d) {
            return d.width;
        })
        .attr("height", function (d) {
            return d.height;
        })
        .style("fill", "#323439")
        .style("stroke", "#676a72")
        .on('click', function (d) {
            d.click++;
            if ((d.click) % 4 == 0) {
                d3.select(this).style("fill", "#fff");
            }
            if ((d.click) % 4 == 1) {
                d3.select(this).style("fill", "#2C93E8");
            }
            if ((d.click) % 4 == 2) {
                d3.select(this).style("fill", "#F56C4E");
            }
            if ((d.click) % 4 == 3) {
                d3.select(this).style("fill", "#838690");
            }
        });
}

require('electron').ipcRenderer.on('ping', (event, message) => {
    pieChart(message);
    barChart(message);
});