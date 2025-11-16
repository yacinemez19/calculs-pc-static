// Conversion de nombres en mots français
// Inspiré de la bibliothèque num2words pour Python

function numberToWords(num, isLastPart = true) {
    if (num === 0) return 'zéro';
    
    if (num < 0) {
        return 'moins ' + numberToWords(-num, isLastPart);
    }
    
    const ones = [
        '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
        'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
        'dix-sept', 'dix-huit', 'dix-neuf'
    ];
    
    const tens = [
        '', '', 'vingt', 'trente', 'quarante', 'cinquante',
        'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'
    ];
    
    if (num < 20) {
        return ones[num];
    }
    
    if (num < 100) {
        const ten = Math.floor(num / 10);
        const one = num % 10;
        
        if (ten === 7) {
            // 70-79: soixante-dix, soixante et onze, etc.
            if (one === 1) return 'soixante et onze';
            return 'soixante-' + ones[10 + one];
        }
        
        if (ten === 8) {
            // 80-89: quatre-vingts, quatre-vingt-un, etc.
            if (one === 0) {
                // "quatre-vingts" uniquement si c'est la dernière partie du nombre
                return isLastPart ? 'quatre-vingts' : 'quatre-vingt';
            }
            return 'quatre-vingt-' + ones[one];
        }
        
        if (ten === 9) {
            // 90-99: quatre-vingt-dix, quatre-vingt-onze, etc.
            if (one === 1) return 'quatre-vingt-onze';
            return 'quatre-vingt-' + ones[10 + one];
        }
        
        if (one === 0) {
            return tens[ten];
        }
        
        if (one === 1 && (ten === 2 || ten === 3 || ten === 4 || ten === 5 || ten === 6)) {
            return tens[ten] + ' et un';
        }
        
        return tens[ten] + '-' + ones[one];
    }
    
    if (num < 1000) {
        const hundred = Math.floor(num / 100);
        const rest = num % 100;
        
        let result = '';
        if (hundred === 1) {
            result = 'cent';
        } else {
            result = ones[hundred] + ' cent';
        }
        
        // Pluriel de cent
        if (rest === 0 && hundred > 1) {
            result += 's';
        }
        
        if (rest > 0) {
            result += ' ' + numberToWords(rest, isLastPart);
        }
        
        return result;
    }
    
    if (num < 1000000) {
        const thousand = Math.floor(num / 1000);
        const rest = num % 1000;
        
        let result = '';
        if (thousand === 1) {
            result = 'mille';
        } else {
            result = numberToWords(thousand, false) + ' mille';
        }
        
        if (rest > 0) {
            result += ' ' + numberToWords(rest, isLastPart);
        }
        
        return result;
    }
    
    if (num < 1000000000) {
        const million = Math.floor(num / 1000000);
        const rest = num % 1000000;
        
        let result = '';
        if (million === 1) {
            result = 'un million';
        } else {
            result = numberToWords(million, false) + ' millions';
        }
        
        if (rest > 0) {
            result += ' ' + numberToWords(rest, isLastPart);
        }
        
        return result;
    }
    
    if (num < 1000000000000) {
        const billion = Math.floor(num / 1000000000);
        const rest = num % 1000000000;
        
        let result = '';
        if (billion === 1) {
            result = 'un milliard';
        } else {
            result = numberToWords(billion, false) + ' milliards';
        }
        
        if (rest > 0) {
            result += ' ' + numberToWords(rest, isLastPart);
        }
        
        return result;
    }
    
    return num.toString();
}

