import fs from 'fs';
import ICONS from '../dist/icons.json';

fs.writeFileSync('./icons.txt', Object.keys(ICONS).join('\n'));
