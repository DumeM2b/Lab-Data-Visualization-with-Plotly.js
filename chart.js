// Définition de l'URL de l'API
const apiRoute = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Fonction pour récupérer les données depuis l'API
async function getData() {
    result = await fetch(apiRoute)
    data = await result.json();
    return data
}

// Fonction pour créer la carte des tremblements de terre
async function createMap() {
    // Récupération des données
    const data = await getData();
    if (!data) return;

    // Transformation des données pour la carte
    const earthquakes = data.features.map(feature => ({
        coordinates: feature.geometry.coordinates.slice(0, 2),
        magnitude: feature.properties.mag,
        place: feature.properties.place,
        time: new Date(feature.properties.time),
        title: feature.properties.title
    }));

    // Configuration des données de la carte
    const plotData = [{
        type: 'scattergeo',
        mode: 'markers',
        lon: earthquakes.map(eq => eq.coordinates[0]),
        lat: earthquakes.map(eq => eq.coordinates[1]),
        text: earthquakes.map(eq => `${eq.title}<br>Magnitude: ${eq.magnitude}<br>Place: ${eq.place}<br>Time: ${eq.time}`),
        marker: {
            size: earthquakes.map(eq => eq.magnitude * 5),
            color: earthquakes.map(eq => eq.magnitude),
            colorscale: 'Viridis',
            cmin: 0,
            cmax: Math.max(...earthquakes.map(eq => eq.magnitude)),
            colorbar: {
                title: 'Magnitude'
            }
        }
    }];

    // Configuration de la mise en page de la carte
    const layout = {
        title: 'Earthquakes Around the World',
        geo: {
            projection: {
                type: 'natural earth'
            },
            landcolor: 'transparent',
            bgcolor: 'transparent',
            showcoastlines: true,
            coastlinewidth: 0.3,
            showland: true,
            showocean:true,
            oceancolor: 'white',
            landcolore: 'black',
            showcountries: true,
            countrycolor: 'black',
            countrywidth: 0.3,
        },
        font: {
            color: 'white'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
    };

    // Configuration supplémentaire
    var config = {
        displayModeBar: false
    };

    // Création de la carte
    Plotly.newPlot('map', plotData, layout, config);
}

// Fonction pour créer le graphique en barres
async function createBarChart() {
    // Récupération des données
    const data = await getData();
    if (!data) return;

    // Transformation des données pour le graphique
    const magnitudes = data.features.map(feature => feature.properties.mag);

    // Configuration des données du graphique
    const plotData = [{
        x: magnitudes,
        type: 'histogram',
        marker: {
            color: 'white'
        }
    }];

    // Configuration de la mise en page du graphique
    const layout = {
        title: 'Histogram of Earthquake Magnitudes',
        xaxis: {
            title: 'Magnitude'
        },
        yaxis: {
            title: 'Number of Earthquakes',
        },
        font: {
            color: 'white'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    // Configuration supplémentaire
    var config = {
        displayModeBar: false
    };

    // Création du graphique
    Plotly.newPlot('barchart', plotData, layout, config);
}

// Fonction pour créer le graphique en ligne
async function createLineChart() {
    // Récupération des données
    const data = await getData();
    if (!data) return;

    // Transformation des données pour le graphique
    const earthquakes = data.features.map(feature => ({
        magnitude: feature.properties.mag,
        time: new Date(feature.properties.time),
    }));

    // Création de l'objet pour stocker la fréquence des séismes pour chaque jour
    const frequencyMap = {};
    earthquakes.forEach(eq => {
        const date = eq.time;
        const formattedDate = `${date.getFullYear().toString().slice(-2)}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
        if (frequencyMap[formattedDate]) {
            frequencyMap[formattedDate]++;
        } else {
            frequencyMap[formattedDate] = 1;
        }
    });

    // Conversion de l'objet en tableaux de dates et de fréquences
    const dates = Object.keys(frequencyMap).reverse();
    const frequencies = Object.values(frequencyMap).reverse();

    // Configuration des données du graphique
    const plotData = [{
        x: dates,
        y: frequencies,
        type: 'line'
    }];

    // Configuration de la mise en page du graphique
    const layout = {
        title: 'Line Chart of Earthquake Frequency by Day',
        xaxis: {
            title: 'Date',
            showgrid: false
        },
        yaxis: {
            title: 'Number of Earthquakes',
            showgrid: false
        },
        font: {
            color: 'white'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    // Configuration supplémentaire
    var config = {
        displayModeBar: false
    };

    // Création du graphique
    Plotly.newPlot('linechart', plotData, layout, config);
}

// Fonction pour créer le graphique de dispersion
async function createDotPlot() {
    // Récupération des données
    const data = await getData();
    if (!data) return;

    // Transformation des données pour le graphique
    const earthquakes = data.features.map(feature => ({
        depth: feature.geometry.coordinates.slice(2, 3),
        magnitude: feature.properties.mag,
    }));

    // Configuration des données du graphique
    const plotData = [{
        type: 'scatter',
        y: earthquakes.map(eq => eq.depth[0]),
        x: earthquakes.map(eq => eq.magnitude),
        mode: 'markers',
        name: 'Magnitude vs Depth',
        marker: {
            color: 'rgba(156, 165, 196, 0.95)',
            line: {
            color: 'rgba(156, 165, 196, 1.0)',
            width: 1,
            },
            symbol: 'circle',
            size: 5
        }
    }];

    // Configuration de la mise en page du graphique
    var layout = {
        title: 'Magnitude vs Depth',
        xaxis: {
            title: 'Magnitude',
            showgrid: false
        },
        yaxis: {
            title: 'Depth',
            showgrid: false
        },
        font: {
            color: 'white'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    // Configuration supplémentaire
    var config = {
        displayModeBar: false
    };

    // Création du graphique
    Plotly.newPlot('plotdot', plotData, layout, config);
}

// Appel des fonctions pour créer les visualisations
createMap();
createBarChart();
createLineChart();
createDotPlot();
