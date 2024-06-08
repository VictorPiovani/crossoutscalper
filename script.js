document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://crossoutdb.com/api/v2/items';
    const tableBody = document.querySelector('#itemsTable tbody');
    const loader = document.getElementById('loader');
    const itemsTable = document.getElementById('itemsTable');
    const rarityFilter = document.getElementById('rarityFilter');

    function fetchDataAndUpdateTable() {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data fetched:', data); // Log para verificar a resposta da API
                if (Array.isArray(data) && data.length > 0) {
                    populateFilters(data);
                    displayItems(data);
                    loader.style.display = 'none';
                    itemsTable.style.display = 'table';

                    rarityFilter.addEventListener('change', () => {
                        filterItems(data);
                    });
                } else {
                    console.error('No items found in data:', data); // Log de erro se data não for um array ou estiver vazio
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function populateFilters(items) {
        const rarities = [...new Set(items.map(item => item.rarityName))];

        if (rarityFilter) {
            rarityFilter.innerHTML = '<option value="">All Rarities</option>';
            rarities.forEach(rarity => {
                if (rarity) {
                    const option = document.createElement('option');
                    option.value = rarity;
                    option.text = rarity;
                    rarityFilter.appendChild(option);
                }
            });
        }
    }

    function displayItems(items) {
        tableBody.innerHTML = '';
        items.forEach(item => {
            const margin = item.sellPrice - item.buyPrice;
            const roi = (margin / item.formatbuyPrice) * 100;
            const profit = (item.formatSellPrice * 0.9) - item.formatbuyPrice;
            const imageUrl = `https://crossoutdb.com${item.imagePath}`;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${imageUrl}" class="item-image" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>${item.rarityName || 'Unknown'}</td>
                <td>${item.sellOffers}</td>
                <td>${item.formatSellPrice}</td>
                <td>${item.buyOrders}</td>
                <td>${item.formatBuyPrice}</td>
                <td>${margin.toFixed(2)}</td>
                <td>${roi.toFixed(2)}%</td>
                <td>${profit.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });

        // Adicionar ordenação para as colunas
        const headers = document.querySelectorAll('#itemsTable th');
        headers.forEach((header, index) => {
            header.addEventListener('click', () => {
                sortTable(index);
            });
        });
    }

    function filterItems(items) {
        const rarity = rarityFilter.value;

        const filteredItems = items.filter(item => {
            return rarity === '' || item.rarityName === rarity;
        });

        displayItems(filteredItems);
    }

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
                    if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
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

    // Buscar dados pela primeira vez
    fetchDataAndUpdateTable();

    // Configurar auto-refresh a cada 10 minutos (600000 ms)
    setInterval(fetchDataAndUpdateTable, 600000);
});
