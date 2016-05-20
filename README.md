# Welcome to Oakwood
Oakwood css - it's a framework for styling your applications

## SCSS based
Sass is the most mature, stable, and powerful professional grade CSS extension language in the world

## Build and Development mode
A development building is run by ```npm run development```. It starts webpack in wathcing mode.  
To compile debug and minified versions run ```npm run compile```.
In both cases, the compiled files are placed to ```compiled``` folder.

## How to use in own project
Module has some shared settings for webpack. To use it you need to import ```oakwood``` module like ```var oakwood = require('oakwood');```. Then ```oakwood``` will have ```nsbuilder``` – postcss plugin to compile oakwood dialect.

## License
Created by CycloneLabs Ltd. Released under the [MIT license](LICENSE.md)
