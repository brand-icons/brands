'use strict';

// You will use `brand-icons/icons`
import {medium} from '../dist/icons';

const mediumIcon = document.getElementById('medium-logo');

mediumIcon.outerHTML = medium.toSvg();
