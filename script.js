// Load data from JSON file and populate the table
window.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#data-table tbody');

            // Clear existing rows
            tableBody.innerHTML = '';

            // Populate rows with data
            data.forEach(row => {
                const tableRow = document.createElement('tr');

                tableRow.innerHTML = `
                    <td>${row['Country code']}</td>
                    <td>${row['Country name']}</td>
                    <td>${row['CPC mainstream']}</td>
                    <td>${row['CPM mainstream']}</td>
                    <td>${row['CPC adult']}</td>
                    <td>${row['CPM adult']}</td>
                `;

                tableBody.appendChild(tableRow);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
