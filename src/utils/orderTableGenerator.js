export const orderTableGenerator = ({ orderData, salesData, skuData, type = "file", selectedWareHouse }) => {
    const minLength = Math.min(orderData.length, salesData.length, skuData.length);
    orderData = orderData.splice(0, minLength);
    skuData = skuData.splice(0, minLength)
    let formatedSalesData = []
    salesData.splice(0, minLength).map(elm => {
        let obj = {}
        for (let name in elm) {
            obj[name.trim()] = elm[name]
        }
        formatedSalesData.push(obj)
        return elm
    });
    let fields
    if (type === "file") {
        fields = Object.keys(formatedSalesData[0]).slice(2)
    } else {
        fields = Object.keys(formatedSalesData[0])
    }
    let formatedData = []
    for (let j = 0; j < minLength; j++) {
        let prices = {
            [orderData[j]["Order 1"]]: orderData[j]["__EMPTY_1"],
            [orderData[j]["Order 2"]]: orderData[j]["__EMPTY_2"],
            [orderData[j]["Order 3"]]: orderData[j]["__EMPTY_3"],
            currentPrice: orderData[j]["__EMPTY_1"],
            avalibleCount: [orderData[j]["Order 1"]],
            priceIndex: 0
        }
        let rowData = {}
        for (let i = 0; i < fields.length; i++) {
            let price = 0
            if (formatedSalesData[j][fields[i]] < prices.avalibleCount) {
                price = formatedSalesData[j][fields[i]] * prices[Object.keys(prices)[prices.priceIndex]]
                prices.avalibleCount -= formatedSalesData[j][fields[i]]
            } else {
                let currentPrice = prices.avalibleCount * prices.currentPrice
                prices.priceIndex++
                prices.currentPrice = prices[Object.keys(prices)[prices.priceIndex]]
                let nextCount = formatedSalesData[j][fields[i]] - prices.avalibleCount
                let nextPrice = nextCount * prices[Object.keys(prices)[prices.priceIndex]]
                prices.avalibleCount = +Object.keys(prices)[prices.priceIndex] - nextCount
                price = currentPrice + nextPrice
            }
            rowData[fields[i]] = price * selectedWareHouse
        }
        rowData["SKU"] = skuData[j]["SKU"]
        rowData["stock"] = prices.avalibleCount
        rowData["Stock Threshold"] = skuData[j]["Stock Threshold"]
        rowData["eof"] = prices.avalibleCount * prices.currentPrice
        formatedData.push(rowData)
    }
    fields.unshift("SKU")
    fields.push("stock", "Stock Threshold", "eof")
    return { fields, formatedData }
}