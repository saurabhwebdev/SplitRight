// API URL for COVID-19 data
const API_URL = 'https://disease.sh/v3/covid-19';

// Function to fetch global data
async function fetchGlobalData() {
    const response = await fetch(`${API_URL}/all`);
    const data = await response.json();
    
    document.getElementById('global-cases').textContent = data.cases.toLocaleString();
    document.getElementById('global-deaths').textContent = data.deaths.toLocaleString();
    document.getElementById('global-recovered').textContent = data.recovered.toLocaleString();
}

// Function to fetch country data
async function fetchCountryData() {
    const response = await fetch(`${API_URL}/countries`);
    const data = await response.json();
    
    const countrySelect = document.getElementById('country-select');
    data.forEach(country => {
        const option = document.createElement('option');
        option.value = country.country;
        option.textContent = country.country;
        countrySelect.appendChild(option);
    });

    countrySelect.addEventListener('change', async (e) => {
        const country = e.target.value;
        if (country) {
            const response = await fetch(`${API_URL}/countries/${country}`);
            const data = await response.json();
            
            const countryData = document.getElementById('country-data');
            countryData.innerHTML = `
                <p><strong>Cases:</strong> ${data.cases.toLocaleString()}</p>
                <p><strong>Deaths:</strong> ${data.deaths.toLocaleString()}</p>
                <p><strong>Recovered:</strong> ${data.recovered.toLocaleString()}</p>
            `;
        }
    });
}

// Function to create cases trend chart
async function createCasesTrendChart() {
    const response = await fetch(`${API_URL}/historical/all?lastdays=30`);
    const data = await response.json();
    
    const dates = Object.keys(data.cases);
    const cases = Object.values(data.cases);

    const ctx = document.getElementById('cases-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Global Cases',
                data: cases,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize the dashboard
async function initDashboard() {
    await fetchGlobalData();
    await fetchCountryData();
    await createCasesTrendChart();
}

initDashboard();