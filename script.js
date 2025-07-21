let myChart;

// ✅ Fetch countries safely added!
async function fetchCountries() {
    try {
        const response = await fetch('fetch_countries.php');
        const countries = await response.json();

        const countrySelect = document.getElementById('country');
        countrySelect.innerHTML = '<option value="">All Countries</option>';

        countries.forEach(country => {
            let option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        });

        console.log("🌍 Countries loaded successfully.");
    } catch (error) {
        console.error("❌ Error fetching countries:", error);
    }
}

// ✅ Fetch categories on page load
async function fetchCategories() {
    try {
        const response = await fetch('fetch_categories.php');
        const categories = await response.json();

        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = '<option value="">All Categories</option>';

        categories.forEach(category => {
            let option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });

        console.log("✅ Categories loaded successfully.");
    } catch (error) {
        console.error("❌ Error fetching categories:", error);
    }
}

// ✅ Fetch data and update chart
async function fetchData() {
    const start_date = document.getElementById('start_date').value;
    const end_date = document.getElementById('end_date').value;
    const country = document.getElementById('country').value;
    const category = document.getElementById('category').value;
    const predictionDisplay = document.getElementById('predictionDisplay');

    if (!start_date || !end_date) {
        alert("⚠️ Please select both start and end dates!");
        return;
    }

    try {
        console.log("🔍 Fetching historical data...");
        const historyResponse = await fetch(`fetch_data.php?start_date=${start_date}&end_date=${end_date}&category=${category}&country=${country}`);
        const historicalData = await historyResponse.json();
        console.log("📊 Historical Data:", historicalData);

        console.log("🔮 Fetching prediction data...");
        const predictionsResponse = await fetch('fetch_prediction.php');
        const predictionsData = await predictionsResponse.json();
        console.log("📈 Predictions Data:", predictionsData);

        const allData = [...historicalData, ...predictionsData];

        if (allData.length === 0) {
            alert("⚠️ No data available for the selected filters.");
            return;
        }

        const labels = allData.map(d => d.record_date);
        const values = allData.map(d => d.value);
        const events = allData.map(d => d.event_name || "No event");

        const lastPrediction = predictionsData.length > 0 ? predictionsData[predictionsData.length - 1].value : "No Predictions Available";
        predictionDisplay.innerHTML = `<strong>Latest Prediction:</strong> ${lastPrediction}`;

        renderChart(labels, values, events);
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        alert("⚠️ Error fetching data. Check console for details.");
    }
}

// 🎨 Render the chart with the fruit salad color palette
function renderChart(labels, values, events) {
    console.log("📊 Rendering chart with:", labels, values);

    const ctx = document.getElementById('chart').getContext('2d');
    const chartType = document.getElementById('chartType').value;

    if (myChart) myChart.destroy();

    // Fruit salad colors based on the uploaded image (teal, blue shades)
    const colors = [
        'rgba(63, 81, 181, 0.5)',  // Indigo (blue shade)
        'rgba(33, 150, 243, 0.5)',  // Light Blue (Vibrant)
        'rgba(38, 198, 218, 0.5)',  // Aqua (Teal-like)
        'rgba(0, 188, 212, 0.5)',   // Cyan (Bright Blue)
        'rgba(0, 150, 136, 0.5)',   // Teal
        'rgba(0, 188, 212, 0.7)',   // Dark Cyan
        'rgba(0, 200, 255, 0.5)',   // Lighter Cyan
        'rgba(3, 169, 244, 0.5)'    // Lighter Blue
    ];

    const borderColors = colors.map(c => c.replace('0.5', '1'));  // Darker borders

    myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Historical Data',
                data: values,
                backgroundColor: colors,
                borderColor: borderColors,
                borderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                fill: false,  // No fill under the curve
                tension: 0.3  // Smooth curves if it's a line chart
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let index = context.dataIndex;
                            return `Event: ${events[index]}\nValue: ${context.raw}`;
                        }
                    }
                },
                legend: {
                    labels: {
                        color: '#333',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#666',
                        font: {
                            size: 12
                        },
                        autoSkip: true,   // Automatically skips labels to prevent overlap
                        maxRotation: 45,  // Rotate labels if necessary
                        minRotation: 30   // Set minimum rotation for better readability
                    },
                    grid: {
                        color: '#eee'
                    }
                },
                y: {
                    ticks: {
                        color: '#666',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: '#eee'
                    }
                }
            },
            onClick: function(event, elements) {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    displayEventName(events[index]);
                }
            }
        }
    });
}

// 📝 Display event name when clicked
function displayEventName(eventName) {
    const eventDisplay = document.getElementById('eventDisplay');
    eventDisplay.innerText = "Event: " + (eventName || "No event available");
    eventDisplay.classList.remove("hidden");
}

// 🚀 Load everything on page ready
document.addEventListener("DOMContentLoaded", function () {
    fetchCategories();
    fetchCountries();

    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", function () {
            console.log("✅ Search button clicked! Fetching data...");
            fetchData();
        });
    } else {
        console.error("❌ ERROR: Search button NOT FOUND!");
    }

    const realTimeBtn = document.getElementById("realTimeBtn");
    if (realTimeBtn) {
        realTimeBtn.addEventListener("click", function () {
            console.log("🔄 Real-Time button clicked.");
            const newTab = window.open("realtime.html", "_blank");

            if (!newTab) {
                alert("⚠️ Pop-up blocked! Please allow pop-ups for this site.");
            }
        });
    }
});
