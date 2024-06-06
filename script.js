document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://crossoutdb.com/api/v2/items';
    const filterInput = document.getElementById('filterInput');
    const tableBody = document.querySelector('#itemsTable tbody');

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data fetched:', data); // Log para verificar a resposta da API
            if (data && data.items) {
                const items = data.items;
                displayItems(items);

                filterInput.addEventListener('input', () => {
                    const filteredItems = items.filter(item => 
                        item.name.toLowerCase().includes(filterInput.value.toLowerCase()));
                    displayItems(filteredItems);
                });
            } else {
                console.error('No items found in data:', data); // Log de erro se items não estiver presente
            }
        })
        .catch(error => console.error('Error fetching data:', error));

    function displayItems(items) {
        tableBody.innerHTML = '';
        items.forEach(item => {
            const margin = item.sellPrice - item.buyPrice;
            const roi = (margin / item.buyPrice) * 100;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.rarityName}</td>
                <td>${item.sellOffers}</td>
                <td>${item.sellPrice}</td>
                <td>${item.buyOrders}</td>
                <td>${item.buyPrice}</td>
                <td>${margin.toFixed(2)}</td>
                <td>${roi.toFixed(2)}%</td>
            `;
            tableBody.appendChild(row);
        });
    }
});

// Função para ordenar a tabela
function sortTable(n) {
    const table = document.getElementById("itemsTable");
    let rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    dir = "asc"; 
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++; 
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}
