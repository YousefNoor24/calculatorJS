const buttons = document.querySelectorAll('button')
const displayInput = document.querySelector('#display #input')
const displayOutput = document.querySelector('#display #output')

let input = "";

for (let button of buttons) {
    const value = button.dataset.key;

    button.addEventListener('click', () => {
        if (value === 'clear') {
            input = ""
            displayInput.innerHTML = ""
            displayOutput.innerHTML = ""
        } else if (value === 'delete') {
            input = input.slice(0, -1)
            displayInput.innerHTML = cleanInput(input)
        } else if (value === '=') {
            let result = eval(perpareInput(input));
            displayOutput.innerHTML = cleanOutput(result)
        } else if (value === "brackets") {
			if (
				input.indexOf("(") === -1 || 
				input.indexOf("(") !== -1 && 
				input.indexOf(")") !== -1 && 
				input.lastIndexOf("(") < input.lastIndexOf(")")
			) {
				input += "(";
			} else if (
				input.indexOf("(") !== -1 && 
				input.indexOf(")") === -1 || 
				input.indexOf("(") !== -1 &&
				input.indexOf(")") !== -1 &&
				input.lastIndexOf("(") > input.lastIndexOf(")")
			) {
				input += ")"
			}

			displayInput.innerHTML = cleanInput(input)
		} else {
            if (validateInput(value)) {
                input += value
                displayInput.innerHTML = cleanInput(input)
            }
        }
    })
}

const cleanInput = (input) => {
    let inputArr = input.split('')
    
    for (let i = 0; i < inputArr.length; i++) {
        if(inputArr[i] === '*' || inputArr[i] === 'x') {
            inputArr[i] = '<span class="operator">x</span>'
        } else if (inputArr[i] === '/' ||input[i] === '÷') {
            inputArr[i] = '<span class="operator">÷</span>'
        } else if (inputArr[i] === '-') {
            inputArr[i] = '<span class="operator">-</span>'
        } else if (inputArr[i] === '+') {
            inputArr[i] = '<span class="operator">+</span>'
        } else if (inputArr[i] === '%') {
            inputArr[i] = '<span class="percent">%</span>'
        }
    }

    return inputArr.join('')
}

const cleanOutput = (output) => {
    let outputString = output.toString()
    let decimal = outputString.split('.')[1]
    outputString = outputString.split('.')[0]

    let outputArr = outputString.split('')

    if (outputArr.length > 3) {
        for (let i = outputArr.length - 3; i > 0; i-=3) {
            outputArr.splice(i, 0, ',')
        }
    }

    if (decimal) {
        outputArr.push('.')
        outputArr.push(decimal)
    }

    return outputArr.join('')
}

const validateInput = (value) => {
    let lastInput = input.slice(-1)
    let operators = ['+', '-', '*', '/']

    if (value === '.' && lastInput === '.') {
        return false
    }

    if (operators.includes(value)) {
        if(operators.includes(lastInput)){
            return false
        } else {
            return true
        }
    }

    return true
}

const perpareInput = (input) => {
    // Replace percentages with their decimal equivalent
    let preparedInput = input.replace(/%/g, "/100");

    // Split the input into individual tokens
    let tokens = preparedInput.match(/(\d+\.\d+|\d+|\S)/g) || [];

    // Process each token to remove leading zeros in numbers
    for (let i = 0; i < tokens.length; i++) {
        if (!isNaN(tokens[i]) && tokens[i][0] === '0' && tokens[i].length > 1 && tokens[i][1] !== '.') {
            tokens[i] = tokens[i].replace(/^0+/, '');
        }
    }

    return tokens.join('');
}