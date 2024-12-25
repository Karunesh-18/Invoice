document.getElementById("addItem").addEventListener("click", () => {
    const itemsTableBody = document.getElementById("itemsTableBody");
    const itemCount = itemsTableBody.children.length + 1;

    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" id="description${itemCount}" required></td>
        <td><input type="number" id="quantity${itemCount}" min="1" required></td>
        <td><input type="number" id="unitPrice${itemCount}" min="0.01" step="0.01" required></td>
        <td><input type="number" id="taxRate${itemCount}" min="0" step="0.01"></td>
        <td>₹<span id="total${itemCount}">0.00</span></td>
        <td>
            <button type="button" onclick="deleteItem(${itemCount})">Delete</button>
        </td>
    `;
    itemsTableBody.appendChild(row);

    // Add event listeners to update totals when input values change
    row.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', updateItemsTable);
    });

    updateItemsTable();
});

function updateItemsTable() {
    const itemsTableBody = document.getElementById("itemsTableBody");
    const rows = itemsTableBody.getElementsByTagName("tr");
    let subtotal = 0;

    for (let i = 0; i < rows.length; i++) {
        const description = rows[i].querySelector(`#description${i + 1}`).value;
        const quantity = parseFloat(rows[i].querySelector(`#quantity${i + 1}`).value);
        const unitPrice = parseFloat(rows[i].querySelector(`#unitPrice${i + 1}`).value);
        const taxRate = parseFloat(rows[i].querySelector(`#taxRate${i + 1}`).value || 0);
        const total = quantity * unitPrice * (1 + taxRate / 100);

        rows[i].querySelector(`#total${i + 1}`).innerText = total.toFixed(2);
        subtotal += total;
    }

    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    document.getElementById('subtotal').innerText = subtotal.toFixed(2);
    document.getElementById('tax').innerText = tax.toFixed(2);
    document.getElementById('total').innerText = total.toFixed(2);
}

function deleteItem(index) {
    const row = document.getElementById("itemsTableBody").children[index - 1];
    row.remove();
    updateItemsTable();
}

function submitDetails(event) {
    event.preventDefault();

    const customerName = document.getElementById("customerName").value;
    const customerAddress = document.getElementById("customerAddress").value;

    const itemsTableBody = document.getElementById("itemsTableBody");
    const items = [...itemsTableBody.getElementsByTagName("tr")].map((row, index) => ({
        description: row.querySelector(`#description${index + 1}`).value,
        quantity: parseFloat(row.querySelector(`#quantity${index + 1}`).value),
        unitPrice: parseFloat(row.querySelector(`#unitPrice${index + 1}`).value),
        taxRate: parseFloat(row.querySelector(`#taxRate${index + 1}`).value || 0)
    }));

    const invoiceData = {
        customerName,
        customerAddress,
        items
    };

    localStorage.setItem('invoiceData', JSON.stringify(invoiceData));
    window.open('invoice.html', '_blank');
}

document.getElementById("invoiceForm").addEventListener("submit", submitDetails);

document.getElementById("downloadInvoice").addEventListener("click", () => {
    const element = document.createElement("a");
    const invoiceContent = document.getElementById("invoiceDetails").innerHTML;

    element.setAttribute("href", "data:text/html;charset=utf-8," + encodeURIComponent(invoiceContent));
    element.setAttribute("download", "invoice.html");

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
});

document.getElementById("printInvoice").addEventListener("click", () => {
    window.print();
});
