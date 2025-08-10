class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.shouldResetScreen = false;

        this.previousOperandElement = document.getElementById('previous-operand');
        this.currentOperandElement = document.getElementById('current-operand');

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelectorAll('.btn.number').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.dataset.number);
                this.updateDisplay();
            });
        });

        document.querySelectorAll('.btn.operator').forEach(button => {
            button.addEventListener('click', () => {
                this.handleOperator(button.dataset.action);
                this.updateDisplay();
            });
        });

        document.querySelector('.btn.equals').addEventListener('click', () => {
            this.compute();
            this.updateDisplay();
        });

        document.querySelector('.btn.clear').addEventListener('click', () => {
            this.clear();
            this.updateDisplay();
        });

        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }

        if (number === '.' && this.currentOperand.includes('.')) return;
        if (number === '0' && this.currentOperand === '0') return;

        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    handleOperator(operation) {
        if (operation === 'delete') {
            this.delete();
            return;
        }

        if (this.currentOperand === '') return;

        if (this.previousOperand !== '') {
            this.compute();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.shouldResetScreen) return;

        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];

        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);

        if (this.operation != null) {
            const operationSymbol = this.getOperationSymbol(this.operation);
            this.previousOperandElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${operationSymbol}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    getOperationSymbol(operation) {
        switch (operation) {
            case 'add': return '+';
            case 'subtract': return '−';
            case 'multiply': return '×';
            case 'divide': return '÷';
            default: return '';
        }
    }

    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9' || e.key === '.') {
            this.appendNumber(e.key);
            this.updateDisplay();
        } else if (e.key === '+' || e.key === '-') {
            this.handleOperator(e.key === '+' ? 'add' : 'subtract');
            this.updateDisplay();
        } else if (e.key === '*') {
            this.handleOperator('multiply');
            this.updateDisplay();
        } else if (e.key === '/') {
            e.preventDefault();
            this.handleOperator('divide');
            this.updateDisplay();
        } else if (e.key === 'Enter' || e.key === '=') {
            this.compute();
            this.updateDisplay();
        } else if (e.key === 'Backspace') {
            this.delete();
            this.updateDisplay();
        } else if (e.key === 'Escape') {
            this.clear();
            this.updateDisplay();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
}); 