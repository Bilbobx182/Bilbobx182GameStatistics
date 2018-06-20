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
global.screenDimensions = {width: screen.width, height: screen.height};
global.widthCiaran = screenDimensions.width - (.50 * screenDimensions.width);

function gridData() {
    var data = new Array();
    var xpos = 1;
    var ypos = 1;
    var boxWidth = screenDimensions.width * .01; //hopefully should be consistent across all monitors
    var boxHeight = screenDimensions.height * .016; //Can't test on over 1080, this may look bad.
    var click = 0;

    /*
    28 boxes DOWN
     48 across

    screenHeight / (screenDimensions.height / 40)
     screenWidth / (screenDimensions.width / 40) = scaleAmount 1:40 1 box is representative of 40 pixels
     */

    var relativeX = 0;
    var relativeY = 0;

    // This is really dumb. But I just want to get this shit working. I will refactor later.
    var relativeYIncrement = screenDimensions.height / (screenDimensions.height / 40);
    var relativeXIncrement = screenDimensions.width / (screenDimensions.width / 40);


    for (var row = 0; row < 28; row++) {
        data.push(new Array());

        for (var column = 0; column < screenDimensions.width / 40; column++) {
            data[row].push({
                x: xpos,
                y: ypos,
                width: boxWidth,
                height: boxHeight,
                click: click,
                screenXStart: relativeX,
                screenXEnd: relativeX + relativeXIncrement,
                screenYStart: relativeY,
                screenYEnd: relativeY + relativeYIncrement,
                heatLevel: 0
            })
            relativeX += relativeXIncrement;
            xpos += boxWidth;
        }
        xpos = 1;
        relativeX = 0;

        relativeY += relativeYIncrement;
        ypos += boxHeight;
    }
    return data;
}

global.gridData = gridData();

pieChart(keyPressData);
barChart(keyPressData);
heatMap();

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

    var test = document.getElementById('heatMap');
    test.innerHTML = "";

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
                console.log(d);
            }
            if ((d.click) % 4 == 2) {
                d3.select(this).style("fill", "#F56C4E");
            }
            if ((d.click) % 4 == 3) {
                d3.select(this).style("fill", "#838690");
            }
        });
}


function binarySearchX(x) {

    var minIndex = 0;
    var maxIndex = this.length - 1;
    var currentIndex;
    var currentElement;
    var resultIndex;

    var xValues = [];
    for(let count =0 ; count < screenDimensions.width; count+40) {
        xValues.push(count)
    }

    while (minIndex <= maxIndex) {
        resultIndex = currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = this[currentIndex];

        if (currentElement < x) {
            minIndex = currentIndex + 1;
        }
        else if (currentElement > x) {
            maxIndex = currentIndex - 1;
        }
        else {
            return currentIndex;
        }
    }

    return ~maxIndex;


}

function findWhereInGrid(mouseMovement) {

    /* Binary Search
    firstly look at Y axis. Since every row is on the same Y.
    Then do another binary search on the X axis.
    Return the values.
     */
    // binarySearchY(mouseMovement.y);
    binarySearchX(mouseMovement.x);
}

require('electron').ipcRenderer.on('ping', (event, message) => {
    pieChart(message);
    barChart(message);
});

require('electron').ipcRenderer.on('mouseMove', (event, message) => {
    findWhereInGrid(message);
});