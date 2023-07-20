export const selectPeriod = (fields, from, to) => {
    const startIndex = fields.indexOf(from);
    const endIndex = fields.indexOf(to);

    const startPart = fields.slice(0, 1)
    let middlePart = []
    if (startIndex !== -1 && endIndex !== -1) {
        middlePart = fields.slice(startIndex, endIndex + 1);
    } else if (startIndex === -1 && endIndex !== -1) {
        middlePart = fields.slice(1, endIndex + 1)
    } else if(startIndex !== -1 && endIndex === -1){
        middlePart = fields.slice(startIndex, fields.length - 3)
    }

    const endPart = fields.slice(fields.length - 3)
    return [...startPart, ...middlePart, ...endPart]
}