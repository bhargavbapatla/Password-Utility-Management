const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function randomChar(str) {
    return str[Math.floor(Math.random() * str.length)];
}

export const generatePassword = (req, res) => {
    const {
        length = 16,
        includeUppercase = true,
        includeLowercase = true,
        includeDigits = true,
        includeSymbols = true,
    } = req.body;

    const safeLength = Math.min(Math.max(parseInt(length) || 16, 16), 24);

    let pool = '';
    const required = [];

    if (includeUppercase) { pool += UPPERCASE; required.push(randomChar(UPPERCASE)); }
    if (includeLowercase) { pool += LOWERCASE; required.push(randomChar(LOWERCASE)); }
    if (includeDigits)    { pool += DIGITS;    required.push(randomChar(DIGITS));    }
    if (includeSymbols)   { pool += SYMBOLS;   required.push(randomChar(SYMBOLS));   }

    if (!pool) {
        return res.status(400).json({ error: 'At least one character type must be selected.' });
    }

    const chars = [...required];
    for (let i = 0; i < safeLength - required.length; i++) {
        chars.push(randomChar(pool));
    }

    // Fisher-Yates shuffle
    for (let i = chars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    res.json({ password: chars.join('') });
};
