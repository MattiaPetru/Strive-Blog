// Importa il modulo 'crypto' che è integrato in Node.js. 
// Questo modulo fornisce funzionalità di crittografia, comprese le funzioni per generare numeri casuali sicuri.
import crypto from 'crypto';

console.log(crypto.randomBytes(64).toString('hex'));
// 	crypto.randomBytes(64): Genera 64 byte di dati casuali in formato binario.
// 	.toString('hex'): Converte i dati casuali in una stringa "hex" ovvero esadecimale.