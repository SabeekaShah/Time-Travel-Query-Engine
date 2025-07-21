let myChart;

// Fetch categories for dropdown
async function fetchCategories() {
    try {
        const response = await fetch('fetch_categories.php');
        const categories = await response.json();

        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = '<option value="">All Categories</option>'; // Reset dropdown

        categories.forEach(category => {
            let option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Load categories on page load
document.addEventListener("DOMContentLoaded", fetchCategories);

// Fetch data and update chart
async function fetchData() {
    const start_date = document.getElementById('start_date').value;
    const end_date = document.getElementById('end_date').value;
    const category = document.getElementById('category').value;
    const showPredictions = document.getElementById('showPredictions').checked;

    if (!start_date || !end_date) {
        alert("Please select both start and end dates!");
        return;
    }

    try {
        // Fetch historical data
        const historyResponse = await fetch(`fetch_data.php?start_date=${start_date}&end_date=${end_date}&category=${category}`);
        const historicalData = await historyResponse.json();

        let predictionsData = [];
        if (showPredictions) {
            // Fetch predictions only if checkbox is checked
            const predictionsResponse = await fetch('fetch_predictions.php');
            predictionsData = await predictionsResponse.json();
        }

        // Combine historical and prediction data
        const allData = [...historicalData, ...predictionsData];

        if (allData.length === 0) {
            alert("No data available for the selected filters.");
            return;
        }

        const labels = allData.map(d => d.record_date);
        const values = allData.map(d => d.value);
        const events = allData.map(d => d.event_name || "No event"); // Handle missing event names

        renderChart(labels, values, events);
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching data. Check console for details.");
    }
}

// Render the chart
function renderChart(labels, values, events) {
    const ctx = document.getElementById('chart').getContext('2d');
    const chartType = document.getElementById('chartType').value;

    if (myChart) myChart.destroy(); // Destroy previous chart before re-drawing

    myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Historical & Prediction Data',
                data: values,
                backgroundColor: ['rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(54, 162, 235, 1)'],
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
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

// Function to display event name
function displayEventName(eventName) {
    const eventDisplay = document.getElementById('eventDisplay');
    eventDisplay.innerText = "Event: " + (eventName || "No event available");
    eventDisplay.classList.remove("hidden"); // Show event details
}

// Update chart when chart type changes
document.getElementById("chartType").addEventListener("change", function () {
    if (myChart) fetchData();
});

// Open the real-time data page
document.getElementById("realTimeBtn").addEventListener("click", function () {
    window.open("realtime.html", "_blank");
});
