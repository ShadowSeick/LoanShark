//Control Function
function startLoanShark() {
    
    let loanAmount = document.getElementById("loanAmount").value;
    let termMonths = document.getElementById("termMonths").value;
    let interestRate = document.getElementById("interestRate").value;

    loanAmount = Number.parseInt(loanAmount);
    termMonths = Number.parseInt(termMonths);
    interestRate = Number.parseInt(interestRate);

    if (loanAmount > 0 && termMonths > 0 && interestRate > 0) {
        
        if (interestRate < 100) {
            let paymentArrayLoan = arrayOfPayments(loanAmount, termMonths, interestRate);
            displayLoanInformation(paymentArrayLoan);
        } else {
            alert("You are getting scammed, look another place to get your loan");
        }
    }
    else {
        alert("You have to introduce positive Numbers!")
    }
    
}

//Logic
function totalMonthlyPayment(loanAmount, termMonths, interestRate) {
    return ((loanAmount) * (interestRate /1200)/(1-(1 + (interestRate/1200))**(-termMonths)));
}

function interestPayment(amountToPay, interestRate) {
    return amountToPay * interestRate / 1200;
}

function roundToCents(number) {
    return Number.parseFloat((Math.round(number * 100) /100).toFixed(2));
}

function arrayOfPayments(loanAmount, termMonths, interestRate) {

    //Initiate necessary variables
    let paymentLoanArray = [];
    let monthlyPayment = roundToCents(totalMonthlyPayment(loanAmount, termMonths, interestRate));
    let remainingBalance = loanAmount;
    let month = 0;
    let interestPay = 0;
    let totalInterest = 0;
    let principalPayment = 0;

    for(let i = 0; i < termMonths; i++) {

        interestPay = month > 0 ? 
                                interestPayment(remainingBalance, interestRate) : 
                                interestPayment(loanAmount, interestRate);
        month = 1 + i;
        principalPayment = monthlyPayment - interestPay;
        remainingBalance -= principalPayment;
        totalInterest += interestPay;
 
        interestPay = roundToCents(interestPay);
        principalPayment = roundToCents(principalPayment);
        //Problems with the rounded cents
        remainingBalance = remainingBalance < 0 ? 0 : roundToCents(remainingBalance);
        totalInterest = roundToCents(totalInterest);

        paymentLoanArray.push([month, monthlyPayment, principalPayment, interestPay, totalInterest, remainingBalance]);
    }

    return paymentLoanArray; 
}

//Display Function

function displayLoanInformation(paymentLoanArray) {

    //Gross Information
    let monthlyPayment = document.getElementById("monthlyPayment");
    let totalPrincipal = document.getElementById("totalPrincipal");
    let totalInterest = document.getElementById("totalInterest");
    let totalCost = document.getElementById("totalCost");
    let table = document.getElementById("tableResults");

    let monthlyPaymentAmount = paymentLoanArray[0][1];
    let totalPrincipalAmount = monthlyPaymentAmount + paymentLoanArray[0][5] - paymentLoanArray[0][3];
    let totalInterestAmount = paymentLoanArray[paymentLoanArray.length - 1][4];
    let totalCostAmount = totalPrincipalAmount + totalInterestAmount;


    //Reset element
    monthlyPayment.innerHTML = "";
    totalPrincipal.innerHTML = "";
    totalInterest.innerHTML = "";
    totalCost.innerHTML = "";
    table.innerHTML = "";

    //Insert information for Loan
    for (let i = 0; i < paymentLoanArray.length; i++) {

        let row = table.insertRow();
        let rowInformation = paymentLoanArray[i];

        for (let j = 0; j < rowInformation.length; j++) {
            row.insertCell().innerHTML = rowInformation[j];
        }

    }
    monthlyPayment.innerHTML = `<p class ="fw-bold display-3">${monthlyPaymentAmount}</p>`;
    totalPrincipal.innerHTML = `<p class ="fw-bold">${totalPrincipalAmount}</p>`;
    totalInterest.innerHTML = `<p class ="fw-bold">${totalInterestAmount}</p>`;
    totalCost.innerHTML = `<p class ="fw-bold">${totalCostAmount}</p>`;

}