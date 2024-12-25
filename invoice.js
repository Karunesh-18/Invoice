window.onload = function() {
    const invoiceData = JSON.parse(localStorage.getItem('invoiceData'));
    document.getElementById('customerName').innerText = invoiceData.customerName;
    document.getElementById('customerAddress').innerText = invoiceData.customerAddress;
    document.getElementById('shipName').innerText = invoiceData.customerName;
    document.getElementById('shipAddress').innerText = invoiceData.customerAddress;

    const itemTable = document.getElementById('itemTable');
    let subtotal = 0;

    invoiceData.items.forEach(item => {
        const total = item.quantity * item.unitPrice * (1 + item.taxRate / 100);
        subtotal += total;

        const row = `<tr>
            <td>${item.description}</td>
            <td>₹${item.unitPrice.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>${item.taxRate.toFixed(2)}%</td>
            <td>₹${total.toFixed(2)}</td>
        </tr>`;
        itemTable.insertAdjacentHTML('beforeend', row);
    });

    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    document.getElementById('subtotal').innerText = subtotal.toFixed(2);
    document.getElementById('tax').innerText = tax.toFixed(2);
    document.getElementById('total').innerText = total.toFixed(2);
}

function printInvoice() {
    window.print();
}

function downloadInvoice() {
    const element = document.createElement("a");
    const content = document.body.innerHTML;

    element.setAttribute("href", "data:text/html;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", "invoice.html");

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}

// You can add more functionality to populate data dynamically.
