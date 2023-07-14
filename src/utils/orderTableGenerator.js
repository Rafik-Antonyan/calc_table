export const orderTableGenerator = (data) => {
    console.log(data);
    let formatedData = data.rows.splice(2).map(row => {
        for (let i = 0; i < row.length; i++) {
            if (!row[i]) {
                row = row.splice(0, i)
                break;
            }
        }
        return row
    }).filter(row => row.length)
    let body = { sku: [], stock: [] }
    for (let i = 0; i < formatedData?.length; i++) {
        const [sku, stock, ...orderData] = formatedData[i];

        body.sku.push(sku);
        body.stock.push(stock);

        for (let j = 0; j < orderData.length; j += 2) {
            const orderIndex = Math.floor(j / 2) + 1;
            if (!body[`order${orderIndex}`]) {
                body[`order${orderIndex}`] = { qty: [], unitPrice: [] };
            }
            body[`order${orderIndex}`].qty.push(orderData[j]);
            body[`order${orderIndex}`].unitPrice.push(orderData[j + 1]);
        }
    }
    let headText = Object.keys(body)
    let headers = []

    for (let i = 0; i < headText?.length; i++) {
        if (!Array.isArray(body[headText[i]])) {
            headText[i] = {
                [headText[i]]: [
                    ...Object.keys(body[headText[i]])
                ]
            }
        }
        headers.push(headText[i])
    }

    return { headers, body }
}