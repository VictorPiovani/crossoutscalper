document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://crossoutdb.com/api/v2/items';
    const filterInput = document.getElementById('filterInput');
    const tableBody = document.querySelector('#itemsTable tbody');

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
                    displayItems(data);

                    filterInput.addEventListener('input', () => {
                        const filteredItems = data.filter(item => 
                            item.name.toLowerCase().includes(filterInput.value.toLowerCase()));
                        displayItems(filteredItems);
                    });
                } else {
                    console.error('No items found in data:', data); // Log de erro se data não for um array ou estiver vazio
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function displayItems(items) {
        tableBody.innerHTML = '';
        items.forEach(item => {
            const margin = item.sellPrice - item.buyPrice;
            const roi = (margin / item.buyPrice) * 100;
            const imageUrl = `https://crossoutdb.com${item.imagePath}`;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${imageUrl}" class="item-image" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>${item.rarityName}</td>
                <td>${item.sellOffers}</td>
                <td>${item.formatSellPrice}</td>
                <td>${item.buyOrders}</td>
                <td>${item.formatBuyPrice}</td>
                <td>${item.formatMargin}</td>
                <td>${item.formatRoi}</td>
                <td>${item.popularity}</td>
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
