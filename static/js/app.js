// This javascript script is meant to capture data from the HTML site (i.e. what the user does and then run it through a function or two to feed to the python scrip)

// This function will take a sample variable, and produce the meta data for it. 
function buildMetadata(sample){
  d3.json(`/metadata/${sample}`).then((mysample) => {
      var data = [mysample];
      console.log(data);
    var sample = d3.select("#sample-metadata");
    sample.html("");
    var row = sample.append("ul");
    Object.entries(mysample).forEach(function([key, value]) {
      var cell = sample.append("h6");
        cell.text(`${key}: ${value}`);
    });
  });
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((mysample) =>{

  var pidata = [];
  for (var j = 0; j < mysample.sample_values.length; j++) 
    pidata.push({'id': mysample.otu_ids[j], 'value': mysample.sample_values[j], 'hover': mysample.otu_labels[j]});

  pidata.sort(function(a, b) {
    return (b.value - a.value);
  });
  top10 = pidata.slice(0,10);
  console.log(top10);
  var datapie = [{
    values: top10.map(y => y.value),
    labels: top10.map(y => y.id),
    type: "pie",
    text: top10.map(y => y.hover),
    hoverinfo: "text",
    textinfo: "percent"
  }];

  var layoutpie = {
    // height: 500,
    // width: 500,
    size: "auto",
    showlegend: true
  };
  Plotly.newPlot("pie", datapie, layoutpie);

  // function updatePlotly(newdata) {
  //   var PIE = document.getElementById("pie");
  //   Plotly.restyle(PIE, "values", [newdata]);
  // }

  // var databubble =[{
  //   x: top10.map(y => y.id),
  //   y: top10.map(y => y.value),
  //   mode: 'markers',
  //   marker: {
  //     size: top10.map(y => y.value),
  //     color: top10.map(y => y.id)},
  //   text: top10.map(y => y.hover)
  // }];
  var databubble =[{
    x: mysample.otu_ids,
    y: mysample.sample_values,
    mode: 'markers',
    marker: {
      size: mysample.sample_values,
      color: mysample.otu_ids},
    text: mysample.otu_labels
  }];
  var layoutbubble = {
    // height: 500,
    // width: 1000,
    size: "auto",
    showlegend: false
  };
  Plotly.newPlot("bubble", databubble, layoutbubble);


    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}
)};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
