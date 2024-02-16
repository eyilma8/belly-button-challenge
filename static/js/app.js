
// "names":["940"], "metadata":[{"id": 940, "ethnicity": "Caucasian", "gender": "F", "age": 24.0, "location": "Beaufort/NC", "bbtype": "I", "wfreq": 2.0}
// Use the D3 library to read in samples.json from the 
// URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json.
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'
function panelInfo(id) {
   
    d3.json(url).then(function (data) {
        let sampleData = data;
        let metadata = sampleData.metadata;
        let identifier = metadata.filter(sample =>
            sample.id.toString() === id)[0];
        let panel = d3.select('#sample-metadata');
        panel.html('');
        Object.entries(identifier).forEach(([key, value]) => {
            panel.append('h6').text(`${key}: ${value}`);
        })
    })
};
// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
// Use sample_values as the values for the bar chart.
// Use otu_ids as the labels for the bar chart.
// Use otu_labels as the hovertext for the chart.
function Plots(id) {
    d3.json(url).then(function (data) {
        let sampleData = data;
        let samples = sampleData.samples;
        let identifier = samples.filter(sample => sample.id === id);
        let filtered = identifier[0];
        let OTUvalues = filtered.sample_values.slice(0, 10).reverse();
        let OTUids = filtered.otu_ids.slice(0, 10).reverse();
        let labels = filtered.otu_labels.slice(0, 10).reverse();
        let barTrace = {
            x: OTUvalues,
            y: OTUids.map(object => 'OTU ' + object),
            name: labels,
            type: 'bar',
            orientation: 'h'
        };
        let barLayout = {
            title: `Top 10 OTUs for Subject ${id}`,
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU ID' }
        };
        let barData = [barTrace];
        Plotly.newPlot('bar', barData, barLayout);
        let bubbleTrace = {
            x: filtered.otu_ids,
            y: filtered.sample_values,
            mode: 'markers',
            marker: {
                size: filtered.sample_values,
                color: filtered.otu_ids,
                colorscale: 'Portland'
            },
            text: filtered.otu_labels,
        };
// Create a bubble chart that displays each sample.
// Use otu_ids for the x values.
// Use sample_values for the y values.
// Use sample_values for the marker size.
// Use otu_ids for the marker colors.
// Use otu_labels for the text values.
// Bubble Chart

        let bubbleData = [bubbleTrace];
        let bubbleLayout = {
            title: `OTUs for Subject ${id}`,
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' }
        };
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    })
};

// Display the sample metadata, i.e., an individual's demographic information.
// Display each key-value pair from the metadata JSON object somewhere on the page.

function optionChanged(id) {
    Plots(id);
    panelInfo(id);
};
// Update all the plots when a new sample is selected. Additionally, you are welcome to create any layout that you would like for your dashboard. An example dashboard is shown as follows:
// Deploy your app to a free static page hosting service, such as GitHub Pages. Submit the links to your deployment and your GitHub repo. Ensure that your repository has regular commits and a thorough README.md file
// Advanced Challenge Assignment (Optional with no extra points earning)
// The following task is advanced and therefore optional.
// Adapt the Gauge Chart from https://plot.ly/javascript/gauge-charts/Links to an external site. to plot the weekly washing frequency of the individual.
// You will need to modify the example gauge code to account for values ranging from 0 through 9.
// Update the chart whenever a new sample is selected.
// Weekly Washing Frequency Gauge       
function init() {
    let dropDown = d3.select('#selDataset');
    let id = dropDown.property('value');
    d3.json(url).then(function (data) {
        sampleData = data;
        let names = sampleData.names;
        let samples = sampleData.samples;
        Object.values(names).forEach(value => {
            dropDown.append('option').text(value);
        })
        panelInfo(names[0]);
        Plots(names[0])
    })
};
init();