/**
 * @format
 */

import { polyfillGlobal } from 'react-native/Libraries/Utilities/PolyfillFunctions';
import { Buffer } from 'buffer';
polyfillGlobal('Buffer', () => Buffer);

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
