const salary = 783.35; // Замените на вашу цену
const neapliekamais = 411.29;
const vsaoi = 10.5;
const podHod = 25.5;

const VSAOI = calcPercentage(salary, vsaoi);
const IEN = calcPercentage((salary - VSAOI - neapliekamais), podHod);
const Netto = salary - VSAOI - IEN;


console.log(`VSAOI = ${VSAOI}`);
console.log(`IEN = ${IEN}`);
console.log(`Netto = ${Netto}`);


function strip(number) {
    return (parseFloat(number).toPrecision(7));
}

function calcPercentage(salary, percentage) {
    const result = ((salary * percentage) / 100);
    return parseFloat(strip(result)).toFixed(2);
}