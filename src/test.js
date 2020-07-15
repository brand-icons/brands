import brands from './index';
import getAttributes from '../util/helpers/getAttributes';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class=""><path fill-rule="evenodd" clip-rule="evenodd" d="M0 1h8L0 23V1zm16 0h8v22L16 1zm1 22h-3l-1.5-4h-4l1-3L12 9l5 14z" fill="red"></path></svg>`;
const attrs = getAttributes.parse(svg);

console.log(getAttributes.stringify(attrs));

// console.log(brands.icons.adobe.toSvg());
