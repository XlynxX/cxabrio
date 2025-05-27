export function calculateNettoSalary(bruttoSalary, bonus = 0, taxFree = 510) {
    console.log(`Brutto Salary = ${bruttoSalary}`);
    bruttoSalary = bruttoSalary + bonus;
    bruttoSalary = parseFloat(bruttoSalary).toFixed(2);
    const vsaoi = 10.5;
    const incomeTax = 25.5;

    const VSAOI = calcPercentage(bruttoSalary, vsaoi);
    const IEN = calcPercentage((bruttoSalary - VSAOI - taxFree), incomeTax);
    const NettoSalary = bruttoSalary - VSAOI - IEN;


    console.log(`Brutto Salary = ${bruttoSalary}`);
    console.log(`Tax Free = ${taxFree}`);
    console.log(`VSAOI = ${VSAOI}`);
    console.log(`IEN = ${IEN}`);
    console.log(`Netto = ${NettoSalary}`);

    return {
        VSAOI: parseFloat(VSAOI).toFixed(2),
        IEN: parseFloat(IEN).toFixed(2),
        Netto: parseFloat(NettoSalary).toFixed(2)
    };
}


function strip(number) {
    return (parseFloat(number).toPrecision(7));
}

function calcPercentage(salary, percentage) {
    const result = ((salary * percentage) / 100);
    return parseFloat(strip(result)).toFixed(2);
}
