/*!
* JSTween JavaScript Library v1.0
* http://www.jstween.org/
*
* Copyright 2011, Marco Wolfsheimer
* JSTween by Marco Wolfsheimer is licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License.
*
* Date: Sun Mar 13 12:46:40 2011 -0000
*/
 
/*
TERMS OF USE - EASING EQUATIONS

Open source under the BSD License. 

Copyright © 2001 Robert Penner
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var JSTween = ( function ( that ) {
 
	var __prop = /[\-]{0,1}[0-9\.]{1,}|#[0-9\.abcdef]{3,6}/gi,
		__unit = /[pxemtcin%]{1,2}|deg/gi,
		__value = /[0-9\.\-]{1,}/gi,
		__hexValue = /[0-9a-f]{3,6}/gi,
		__hasHash = /^#/,
		__singleValue = /^[0-9\.\-]{1,}([pxemtcin%]{1,2}|deg)$/,
		__letters = /[a-z]{1,}/,
		__hasRGB = /^rgb\(/,
		__hasScroll = /^scroll/,
		__cssHyphen = /-([a-z])/ig,
		__cssMSHyphen = /^-ms/ig,
		__cssSuportLookup = {
			opacity:[ 'opacity', '-moz-opacity', 'filter' ],
			shadow: [ 'box-shadow', '-moz-box-shadow', '-o-box-shadow', '-ms-box-shadow', '-webkit-box-shadow' ],
			transform: [ '-moz-transform', 'transform', '-o-transform', '-ms-transform','-webkit-transform' ],
			transformOrigin: [ '-moz-transform-origin', 'transform-origin', '-o-transform-origin', '-ms-transform-origin', '-webkit-transform-origin' ],
			borderRadius:[ '-moz-border-radius', 'border-radius', '-webkit-border-radius' ],
			borderRadiusTopLeft:[ '-moz-border-radius-topleft', 'border-top-left-radius', '-webkit-border-top-left-radius' ],
			borderRadiusTopRight:[ '-moz-border-radius-topright', 'border-top-right-radius', '-webkit-border-top-right-radius' ],
			borderRadiusBottomLeft:[ '-moz-border-radius-bottomleft', 'border-bottom-left-radius', '-webkit-border-bottom-left-radius' ],
			borderRadiusBottomRight:[ '-moz-border-radius-bottomright', 'border-bottom-right-radius', '-webkit-border-bottom-right-radius' ],
			backgroundSize: [ 'background-size', '-moz-background-size', '-o-background-size', '-webkit-background-size' ]
		},
		__timeline = {},
		__elements = [],
		__frame = 0,
		__runTime = 0,
		__playing = false,
		__frameTime = false,
		__playTime = 0,
		__config = {};
				
		that.init = function () {
				
			that.framerate(45);
			that.cssSupport();
			
			// Fail nicely if jQuery does not exist
			try{ that.attach();	} catch(e){ return; }		
		};
		
		that.attach = function() {

			jQuery.JSTween = that;			
			
			jQuery.fn.tween = function (options) {
						
				var i, length = this.length;
			
				for( i = 0; i < length; i++ ) {
					jQuery.JSTween.tween(this[i], options);
				}
			
				return this;
			};
			
			jQuery.framerate = function (options) {
				jQuery.JSTween.framerate(options);
			};
			
			jQuery.play = function () {
				jQuery.JSTween.play();
			};
			
			jQuery.clear = function ( elem, prop ) {
				jQuery.JSTween.clear( elem, prop );
			};
			
			jQuery.fn.play = function () {
				jQuery.JSTween.play();
				return this;
			};
			
			jQuery.fn.clear = function (prop) {
			
				var i, length = this.length;

				for( i = 0; i < length; i++ ) {
					jQuery.JSTween.clear(this[i], prop);
				}
				
				return this;
			};
			
			jQuery.fn.property = function (name) {
			
				var prop = [], i, length = this.length;
				
				for( i = 0; i < length; i++ ) {
					prop.push( jQuery.JSTween.property( this[i], name) );
				}
								
				return prop.length === 1 ? prop[0] : prop;
			};
			
			jQuery.fn.opacity = function (value) {

				var i, length = this.length;
						
				for( i = 0; i < length; i++ ) {
					jQuery.JSTween.opacity(this[i], value);
				}
				
				return this;
			};
			
			jQuery.fn.alpha = jQuery.fn.opacity;
			jQuery.fn.transparency = jQuery.fn.opacity;
			
			jQuery.fn.rotate = function (value) {
			
				var i, length = this.length;
				
				for( i = 0; i < length; i++ ) {
					jQuery.JSTween.rotate(this[i], value);
				}
				
				return this;
			};
			
			jQuery.fn.action = function (type, value, units, callback) {
								
				var elementID,
					prop,
					i, 
					length = this.length,
					parsedType = {};
				
				if( typeof type === 'object' ) {

					for( prop in type ) {
						if( type.hasOwnProperty( prop ) && typeof type[prop] === 'string' ) {
							if( type[prop].match( __singleValue ) ) {
								parsedType[prop] = { value: parseFloat( type[prop].match( __value )[0], 10 ), units: type[prop].match( __unit )[0] };
							} else {
								parsedType[prop] = { value: type[prop], units: undefined };														
							}
						}
					}
																
					for( i = 0; i < length; i++ ) {
					
						elementID = jQuery.JSTween.register(this[i]);
					
						for( prop in parsedType ) {
												
							if( parsedType.hasOwnProperty( prop ) ) {
							
								jQuery.JSTween.action( elementID, prop, parsedType[prop].value,  parsedType[prop].units, undefined, true);
							}
						}
					}
					
				} else {
				
					for( i = 0; i < length; i++ ) {
						jQuery.JSTween.action( jQuery.JSTween.register(this[i]), type, value, units, callback, true);
					}
					
				}
				return this;
			};
			
			jQuery.fn.state = function (type) {
				
				if (this.length > 0 ) {
									
					if( this[0].__animate !== undefined ) {
						
						if( type !== undefined && this[0].__animate.state[type] !== undefined  ) {
							return this[0].__animate.state[type];					
						} else if( type === undefined ) {
							return this[0].__animate.state;
						}
					}
				}
			};
			
			jQuery.fn.transform = function (value) {
				
				var i, length = this.length;

				for( i = 0; i < length; i++ ) {
					jQuery.JSTween.transform(this[i], value);
				}
				
				return this;
			};
			
			jQuery.fn.transformOrigin = function (value) {
			
				var i, length = this.length;
				
				for( i = 0; i < length; i++ ) {
					jQuery.JSTween.transformOrigin(this[i], value);
				}
				
				return this;
			};

			jQuery.fn.backgroundSize = function (value) {
			
				var i, length = this.length;
				
				for( i = 0; i < length; i++ ) {
					jQuery.JSTween.backgroundSize(this[i], value);
				}
				
				return this;
			};
						
			jQuery.fn.shadow = function (value) {
				
				var i, length = this.length;
				
				for( i = 0; i < length; i++ ) {
					jQuery.JSTween.shadow(this[i], value);
				}
				
				return this;
			};
			
			jQuery.fn.borderRadius = function (value, units) {
				
				var i, length = this.length;
				
				for( i = 0; i < length; i++ ) {
					jQuery.JSTween.borderRadius(this[i], value, units );
				}
				
				return this;
			};

			jQuery.fn.borderRadiusTopRight = function (value, units) {
				
				var i, length = this.length;
				
				for( i = 0; i < length; i++ ) {
					jQuery.JSTween.borderRadiusCorner(this[i], 'top', 'right', value, units);
				}
				
				return this;
			};
		
			jQuery.fn.borderRadiusTopLeft = function (value, units) {
				
				var i, length = this.length;
				
				for( i = 0; i < length; i++ ) {
					jQuery.JSTween.borderRadiusCorner(this[i], 'top', 'left', value, units);
				}
				
				return this;
			};
			
			jQuery.fn.borderRadiusBottomRight = function (value, units) {
				
				var i, length = this.length;
				
				for( i = 0; i < length; i++ ) {
					jQuery.JSTween.borderRadiusCorner(this[i], 'bottom', 'right', value, units);
				}
				
				return this;
			};
			
			jQuery.fn.borderRadiusBottomLeft = function (value, units) {
				
				var i, length = this.length;
				
				for( i = 0; i < length; i++ ) {
					jQuery.JSTween.borderRadiusCorner(this[i], 'bottom', 'left', value, units);
				}
				return this;
			};
						
			jQuery.fn.borderRadiusCorner = function (top, right, value, units) {
				
				var i, length = this.length;
				
				for( i = 0; i < this.length; i++ ) {
					jQuery.JSTween.borderRadiusCorner(this[i], top, right, value, units);
				}
				return this;
			};
		};

		that.upperCase = function( all, letter ) {
			return letter.toUpperCase();
		};

		that.camelCase = function( string ){
			return string.replace( __cssMSHyphen, 'ms' ).replace( __cssHyphen, that.upperCase );
		};
		
		that.framerate = function (fps) {
			__config.frameRate = fps || 45;
			__config.frameDelay = Math.round(1000 / __config.frameRate);
			__config.frameLength = (1 / __config.frameRate);
		};
		
		that.cssSupport = function(){

			var htmlTag = document.getElementsByTagName('html'), 
				htmlStyle, propType;
			
			if( htmlTag[0] !== undefined ) {
			
				htmlStyle = htmlTag[0].style;
						
				for( propType in __cssSuportLookup ) {
					
					if ( __cssSuportLookup.hasOwnProperty( propType ) ) {

						for( i = 0; i < __cssSuportLookup[ propType ].length; i++ ) {
							if( htmlStyle[ __cssSuportLookup[propType][i] ] !== undefined ) {
								__cssSuportLookup[propType] = __cssSuportLookup[propType][i];
								break;
							} else if ( htmlStyle[ that.camelCase( __cssSuportLookup[propType][i] ) ] !== undefined ) {
								__cssSuportLookup[propType] = that.camelCase( __cssSuportLookup[propType][i] );
								break;
							}							
						}						
					}
				}
			}
		};

		that.property = function (element, name) {
		
			if( element.__animate !== undefined ) {
			
				if( name === undefined ) {
				
					return element.__animate.state;
					
				} else if ( element.__animate.state[name] ) {
				
					return element.__animate.state[name];
					
				} else {
					return false;
				}
			} else {
				return false;
			}
		};

		that.getScroll = function (element, property, stop) {
			if (element.tagName === undefined && ( element.scroll !== undefined || element.scrollTo !== undefined ) ) {
				return $( element ).scrollLeft() + 'px ' + $( element ).scrollTop() + 'px';
			} else {
				return element.scrollLeft + 'px ' + element.scrollTop + 'px';
			}
		};

		that.getComputedStyle = function (element, property, stop) {

			var foundValue = that.property(element, property),
				computedStyle, value, units, scroll;

			// First, see if we have an animation state value for this property already.. much quicker than attacking the DOM
			if (foundValue !== false && !property.match(__hasScroll)) {

				return {
					value: foundValue.value,
					units: element.__animate.state[property].units
				};

			} else {
				
				// Yes I know.. switch isn't wonderfull.. but a necessary way to keep the coad bloat down and performance up in JSTween.
				switch (property) {
	
					case 'transform':
						value = stop;
						break;

					case 'transformOrigin':
						value = stop;
						break;	
	
					case 'shadow':
						value = stop;
						break;

					case 'boxShadow':
						value = stop;
						break;

					case 'backgroundSize':
						value = stop;
						break;
							
					case 'opacity':
						value = 100;
						break;
	
					case 'transparency':
						value = 100;
						break;
	
					case 'alpha':
						value = 100;
						break;
	
					case 'scrollLeft':
						value = that.getScroll(element, property, stop);
						break;
	
					case 'scrollTop':
						value = that.getScroll(element, property, stop);
						break;
	
					case 'scroll':
						value = that.getScroll(element, property, stop);
						break;
	
					case 'scrollTo':
						value = that.getScroll(element, property, stop);
						break;
	
					default:
	
						if (window.getComputedStyle !== undefined) {
	
							computedStyle = window.getComputedStyle(element, null)[property];
	
						} else if (element.currentStyle !== undefined) {
	
							computedStyle = element.currentStyle[property];
						}
																
						if (computedStyle === 'auto' || computedStyle === undefined || computedStyle === '') {
						
							value = 0;
							units = 'px';
							
						} else if( computedStyle.match( __hasRGB ) ) {
						
							value = that.convertRGBToHex( computedStyle );
							
						} else {
						
							value = parseFloat(computedStyle.match( __value ), 10);
							units = computedStyle.match( __unit );
						}
	
						break;
				}

				return {
					value: value,
					units: units
				};

			}
		};

		that.parseOptions = function (element, options) {

			var newOptions = {},
				property, computedStyle;

			for (property in options) {

				if (options.hasOwnProperty(property) && property !== 'onStart' && property !== 'onStop' && property !== 'onFrame') {

					newOptions[property] = {};

					// Find missing start values if needed
					if (options[property].start === undefined) {
						computedStyle = that.getComputedStyle(element, property, options[property].stop);
						newOptions[property].start = computedStyle.value;
					} else {
						newOptions[property].start = that.parseProperty(options[property].start);
					}

					newOptions[property].stop = that.parseProperty(options[property].stop, 1);
					newOptions[property].duration = that.parseProperty(options[property].duration || newOptions[property].dur, 1);
					newOptions[property].time = that.parseProperty(options[property].time, 0);
					newOptions[property].merge = that.parseProperty(options[property].merge, false);
					newOptions[property].effect = that.parseProperty(options[property].effect, 'linear');
					newOptions[property].framerate = that.parseProperty(options[property].framerate, __config.frameRate);
					newOptions[property].units = that.parseProperty(options[property].units, computedStyle ? computedStyle.units : 'px');
					newOptions[property].end = that.parseProperty(options[property].end, (newOptions[property].time + newOptions[property].duration));

					// Clean up scolling metrics and turn them into paired strings
					if (property.match( __hasScroll )) {
						if (typeof newOptions[property].start === 'number') {
							newOptions[property].start = newOptions[property].start + 'px ' + newOptions[property].start + 'px';
						}
						if (typeof newOptions[property].stop === 'number') {
							newOptions[property].stop = newOptions[property].stop + 'px ' + newOptions[property].stop + 'px';
						}
					}

					newOptions[property].callback = {
						onStart: options[property].onStart,
						onFrame: options[property].onFrame,
						onStop: options[property].onStop
					};
				}
			}

			return newOptions;
		};

		that.parseProperty = function (property, defaultValue) {
			if (typeof property === 'function') {
				return property();
			} else if (property !== undefined) {
				return property;
			} else {
				return defaultValue;
			}
		};

		that.convertRGBToHex = function (color) {
				
			var colours = color.match(__value), red, green, blue;
						
			red = parseInt( colours[0], 10 ).toString(16);
				if (red.length === 1) { red = "0" + red; }
						
			green = parseInt( colours[1], 10 ).toString(16);
				if (green.length === 1) { green = "0" + green; }
			
			blue = parseInt( colours[2], 10 ).toString(16);
				if (blue.length === 1) { blue = "0" + blue; }
		
			return '#' + red + green + blue;
		};
				
		that.parseColor = function (color) {
			if (color.length === 3) {
				return [parseInt(color.substr(0, 1), 16) * 16, parseInt(color.substr(1, 1), 16) * 16, parseInt(color.substr(2, 1), 16) * 16];
			} else {
				return [parseInt(color.substr(0, 2), 16), parseInt(color.substr(2, 2), 16), parseInt(color.substr(4, 2), 16)];
			}
		};

		that.parseCSSProperty = function (str) {
				
			var values = str.match( __prop ),
				delimiters = str.split( __prop ),
				units = [],
				id,
				length = values.length;

			for (id = 0; id < length; id++) {
				if (values[id].match(__hasHash)) {
					values[id] = that.parseColor(values[id].match( __hexValue )[0]);
				} else {
					values[id] = parseFloat(values[id].match(__value)[0], 10);
				}
			}

			return {
				value: values,
				delimiter: delimiters
			};
		};

		that.mergeStringProperty = function (start, stop, property, options, time, end) {

			var frameProperty = "",
				color = "",
				i, n, 
				length = start.value.length, 
				startLength = 0;

			for (i = 0; i < length; i++) {

				if (typeof start.value[i] === 'object' && start.value[i].length !== undefined) {

					frameProperty += start.delimiter[i] + "#";
					
					startLength = start.value[i].length;

					for (n = 0; n < startLength; n++) {

						color = Math.round(that.effects[options.effect]((time - options.time), start.value[i][n], (stop.value[i][n] - start.value[i][n]), (end - options.time)), 10).toString(16);

						if (color.length === 1) {
							color = "0" + color;
						}
						frameProperty += color;
					}

				} else {
					frameProperty += start.delimiter[i] + that.effects[options.effect]((time - options.time), start.value[i], (stop.value[i] - start.value[i]), (end - options.time));
				}
			}

			return frameProperty + start.delimiter[start.delimiter.length - 1];
		};
		
		that.loopStringFrames = function( elementID, property, propertyOptions ){

			var frameCounter, 
				startParsed = that.parseCSSProperty(propertyOptions.start), 
				stopParsed = that.parseCSSProperty(propertyOptions.stop), 
				time, 
				offset, 
				frameValue, 
				frameSkip,
				frameLength = __config.frameLength,
				end = propertyOptions.end;


			frameCounter = frameSkip = Math.round(__config.frameRate / propertyOptions.framerate - 1);

			for ( time = propertyOptions.time; time < end; time += frameLength) {

				offset = __frame + Math.round(time * __config.frameRate);

				if (frameCounter === 0) {

					frameValue = that.mergeStringProperty(startParsed, stopParsed, property, propertyOptions, time, propertyOptions.end);
					that.makeFrame(offset, elementID, property, frameValue, propertyOptions.units, false, false);
					frameCounter = frameSkip;

				} else {

					that.makeFrame(offset, elementID, property);
					frameCounter--;
				}
			}
			
			// Final frame, make sure the element lands in the correct place
			offset = __frame + (Math.round(propertyOptions.end * __config.frameRate));
			that.makeFrame(offset, elementID, property, propertyOptions.stop, propertyOptions.units, false, true);
		};
		
		that.loopFrames = function( elementID, property, propertyOptions ){
		
			var frameCounter, 
				time,
				offset, 
				frameValue, 
				frameSkip,
				frameLength = __config.frameLength,
				end = propertyOptions.end;

			frameCounter = frameSkip = Math.round(__config.frameRate / propertyOptions.framerate - 1);	

			for ( time = propertyOptions.time; time < end; time += frameLength) {

				offset = __frame + (Math.round(time * __config.frameRate));

				if (frameCounter === 0) {

					frameValue = that.effects[propertyOptions.effect]((time - propertyOptions.time), propertyOptions.start, (propertyOptions.stop - propertyOptions.start), (propertyOptions.end - propertyOptions.time));
					that.makeFrame(offset, elementID, property, frameValue, propertyOptions.units, false, false);
					frameCounter = frameSkip;

				} else {

					that.makeFrame(offset, elementID, property);
					frameCounter--;
				}
			}
			
			// Final frame, make sure the element lands in the correct place
			offset = __frame + (Math.round(propertyOptions.end * __config.frameRate));
			that.makeFrame(offset, elementID, property, propertyOptions.stop, propertyOptions.units, false, true);
		};
		
		that.getTimeBounds = function( options ) {

			var bounds = { start:0, stop:0 }, property;

			for (property in options) {
				if (options.hasOwnProperty(property)) {
					if( options[property].end > bounds.stop ) { bounds.stop = options[property].end; }
				}				
			}
			
			bounds.start = bounds.stop;
			
			for (property in options) {
				if (options.hasOwnProperty(property)) {
					if( options[property].time < bounds.start ) { bounds.start = options[property].time; }
				}				
			}
			
			return bounds;			
		};

		that.tween = function (element, config) {

			var elementID = that.register(element),
				offset = 0,
				time = 0,
				startParsed, stopParsed, frameSkip = 0,
				options = that.parseOptions(element, config),
				property, 
				bounds = that.getTimeBounds( options );		

			for (property in options) {

				if (options.hasOwnProperty(property)) {


					// Make property frames
					if (typeof options[property].start === 'string') {
						that.loopStringFrames( elementID, property, options[property] );
					} else {
						that.loopFrames( elementID, property, options[property] );
					}



					// PROPERTY CALLBACKS
					
					// onStart
					if (typeof options[property].callback.onStart === 'function') {
						that.addCallback(__frame + (Math.round(options[property].time * __config.frameRate)), elementID, property, options[property].callback.onStart);
					}

					// onFrame
					if (typeof options[property].callback.onFrame === 'function') {
						for (time = options[property].time; time < options[property].end; time += __config.frameLength) {
							offset = __frame + (Math.round(time * __config.frameRate));
							that.addCallback(offset, elementID, property, options[property].callback.onFrame);
						}
					}

					// onStop
					if (typeof options[property].callback.onStop === 'function') {
						that.addCallback(__frame + (Math.round(options[property].end * __config.frameRate)), elementID, property, options[property].callback.onStop);
					}
					
					// CLEANUP

					// Get the offset and increase the current runtime if needed
					offset = __frame + (Math.round(options[property].end * __config.frameRate));

					// Clean up
					if (offset > __runTime) {
						__runTime = offset;
					}

				}
			}

			if (typeof config.onStart === 'function') {
				that.addCallback(__frame + (Math.round(bounds.start * __config.frameRate)), elementID, 'callback', config.onStart);
			}

			if (typeof config.onFrame === 'function') {
				for (frame = __frame + Math.round(bounds.start * __config.frameRate); frame <= __frame + Math.round(bounds.stop * __config.frameRate); frame++) {
					that.addCallback(frame, elementID, 'callback', config.onFrame);
				}
			}
						
			if (typeof config.onStop === 'function') {
				that.addCallback(__frame + (Math.round(bounds.stop * __config.frameRate)), elementID, 'callback', config.onStop);
			}
		};

		that.makeFrame = function (offset, elementID, type, value, units, callback, skip) {

			/// Wow this is long winded.. but we need to check for existing frames, properties and elements. IT COULD be abstracted out into smaller methods but that would have a performance hit
			if (elementID !== undefined) {

				if (__timeline[offset] === undefined) {

					__timeline[offset] = {};
					__timeline[offset][elementID] = {};
					__timeline[offset][elementID][type] = {
						value: value,
						units: units,
						callback: [],
						skip: skip
					};

				} else if (__timeline[offset][elementID] === undefined) {

					__timeline[offset][elementID] = {};
					__timeline[offset][elementID][type] = {
						value: value,
						units: units,
						callback: [],
						skip: skip
					};

				} else if (__timeline[offset][elementID][type] === undefined) {

					__timeline[offset][elementID][type] = {
						value: value,
						units: units,
						callback: [],
						skip: skip
					};

				} else {

					if (value !== false) {
						__timeline[offset][elementID][type].value = value;
					}

					if (units !== false) {
						__timeline[offset][elementID][type].units = units;
					}
					
					__timeline[offset][elementID][type].skip = skip;
					
				}
				
				if (typeof callback === 'function') {
					__timeline[offset][elementID][type].callback.push(callback);
				}

			} else if (__timeline[offset] === undefined) {
				__timeline[offset] = {};
			}

		};
		
		that.addCallback = function (offset, elementID, type, callback) {
			that.makeFrame(offset, elementID, type, false, false, callback, true);
		};

		that.play = function () {
			if (__playing === false) {
				__frameTime = false;
				__playing = true;
				__playTime = that.timestamp();
				that.playHead();
			}
		};

		that.clear = function (element, property) {

			var time;
			
			if( element !== undefined && property !== undefined && element.__animate !== undefined ) {
				
				for (time in __timeline) {
					if (__timeline.hasOwnProperty(time) && __timeline[time][element.__animate.id] !== undefined && __timeline[time][element.__animate.id][property] !== undefined) {
						delete __timeline[time][element.__animate.id][property];
					}
				}
				
			} else if( element !== undefined && element.__animate !== undefined ) {

				for (time in __timeline) {
					if (__timeline.hasOwnProperty(time) && __timeline[time][element.__animate.id] !== undefined) {
						delete __timeline[time][element.__animate.id];
					}
				}

			} else {
			
				for (time in __timeline) {
					if (__timeline.hasOwnProperty(time)) {
						delete __timeline[time];
					}
				}
			}
		};

		that.timestamp = function () {
			var now = new Date();
			return now.getTime();
		};

		that.playHead = function () {

			var current, elementID, type, delay;

			if (__frame <= __runTime ) {

				delay = (__config.frameDelay - ((that.timestamp() - __playTime) - ( __frame * __config.frameDelay)));
				if (delay < 0) {
					delay = 0;
				} else if (delay > __config.frameDelay) {
					delay = __config.frameDelay;
				}

				setTimeout(function () {
					that.playHead(delay ? true : false);
				}, delay);

				for (elementID in __timeline[__frame]) {

					if (__timeline[__frame].hasOwnProperty(elementID)) {

						current = __timeline[__frame][elementID];

						for (type in current) {

							if (current.hasOwnProperty(type)) {
								
								that.action(elementID, type, current[type].value, current[type].units, current[type].callback, ( current[type].skip === true ? true : ( delay ? true : false ) ) );
							}
						}
					}
				}

				delete __timeline[__frame];
				__frame++;
				__frameTime = that.timestamp();

			} else {
				__frameTime = __playing = false;
				__frame = 0;
			}
		};

		that.action = function (elementID, type, value, units, callback, updateDOM ) {

			// Always render the last frame / property for this element
			if (updateDOM === true && value !== false) {
				
				// Again.. the switch of the century.. I don't like this pattern but the altenative is even nastier
				switch (type) {

				case "zIndex":
					__elements[elementID].style.zIndex = value;
					break;

				case "alpha":
					that.opacity(__elements[elementID], value);
					break;

				case "transparency":
					that.opacity(__elements[elementID], value);
					break;

				case "opacity":
					that.opacity(__elements[elementID], value);
					break;

				case "scroll":
					that.scroll(__elements[elementID], type, value);
					break;

				case "scrollTop":
					that.scroll(__elements[elementID], type, value);
					break;

				case "scrollLeft":
					that.scroll(__elements[elementID], type, value);
					break;

				case 'scrollTo':
					that.scroll(__elements[elementID], type, value);
					break;
					
				case 'shadow':
					that.shadow(__elements[elementID], value);
					break;

				case 'boxShadow':
					that.shadow(__elements[elementID], value);
					break;
					
				case 'rotate':
					that.rotate(__elements[elementID], value);
					break;

				case 'transformOrigin':
					that.transformOrigin(__elements[elementID], value);
					break;
					
				case 'transform':
					that.transform(__elements[elementID], value);
					break;

				case 'backgroundSize':
					that.backgroundSize(__elements[elementID], value);
					break;
					
				case 'borderRadius':
					that.borderRadius(__elements[elementID], value, units);
					break;

				case 'borderRadiusTopRight':
					that.borderRadiusCorner(__elements[elementID], 'top', 'right', value, units);
					break;

				case 'borderRadiusTopLeft':
					that.borderRadiusCorner(__elements[elementID], 'top', 'left', value, units);
					break;

				case 'borderRadiusBottomRight':
					that.borderRadiusCorner(__elements[elementID], 'bottom', 'right', value, units);
					break;

				case 'borderRadiusBottomLeft':
					that.borderRadiusCorner(__elements[elementID], 'bottom', 'left', value, units);
					break;

				default:
					if (typeof value === 'string') {
						__elements[elementID].style[type] = value;
					} else {
						__elements[elementID].style[type] = value + units;
					}
					break;
				}
			}

			__elements[elementID].__animate.state[type] = {
				value: value,
				units: units
			};

			if (callback !== undefined && callback.length > 0) {
				for (i = 0; i < callback.length; i++) {
					if (typeof callback[i] === 'function') {
						callback[i](__elements[elementID], {
							type: type,
							value: value,
							units: units,
							id: elementID
						});
					}
				}
			}
		};
	
		that.scroll = function (element, property, value) {

			var parsedValue;

			if (element.tagName === undefined && ( typeof element.scroll === 'function' || typeof element.scrollTo === 'function' ) && typeof value === 'string') {

				parsedValue = value.match(__value);

				if (parsedValue) {
				
					if (self.pageYOffset) {
						window.scroll(parseInt(parsedValue[0], 10), parseInt(parsedValue[1], 10));
					} else if (document.documentElement && document.documentElement.scrollTop) {
						window.scrollTo(parseInt(parsedValue[0], 10), parseInt(parsedValue[1], 10));
					} else if (document.body) {
						window.scrollTo(parseInt(parsedValue[0], 10), parseInt(parsedValue[1], 10));
					}
				}

			} else {

				if (typeof value === 'string') {
					parsedValue = value.match(__value);
				} else {
					parsedValue = [value, value];
				}

				if (property === 'scrollTop') {

					element.scrollTop = parseInt(parsedValue[1], 10);

				} else if (property === 'scrollLeft') {

					element.scrollLeft = parseInt(parsedValue[0], 10);

				} else {

					element.scrollLeft = parseInt(parsedValue[0], 10);
					element.scrollTop = parseInt(parsedValue[1], 10);
				}
			}
		};

		that.setProperty = function( element, prop, value, units ) {
			element.style[prop] = value + ( units ? units : '');
		};
		
		that.opacity = function (element, value) {
			if( __cssSuportLookup.opacity === 'filter' ) {
				that.setProperty(element, 'filter', 'alpha(opacity=' + value + ')');
			} else {
				that.setProperty(element, __cssSuportLookup.opacity,  (value / 100) );
			}
		};

		that.shadow = function (element, value) {		
			that.setProperty(element, __cssSuportLookup.shadow, value);
		};

		that.rotate = function (element, value) {
			that.setProperty(element, __cssSuportLookup.transform, 'rotate(' + value + 'deg)');
		};

		that.transform = function (element, value) {
			that.setProperty(element, __cssSuportLookup.transform, value);
		};

		that.backgroundSize = function (element, value) {
			that.setProperty(element, __cssSuportLookup.backgroundSize, value);
		};

		that.transformOrigin = function (element, value) {
			that.setProperty(element, __cssSuportLookup.transformOrigin, value);
		};
		
		that.borderRadius = function (element, value, units) {
			that.setProperty(element, __cssSuportLookup.borderRadius, value, units);
		};
		
		that.borderRadiusCorner = function (element, upDown, leftRight, value, units) {

			if( upDown === 'top' ) {
			
				if( leftRight === 'left' ) {
					that.setProperty(element, __cssSuportLookup.borderRadiusTopLeft, value, units);
				} else {
					that.setProperty(element, __cssSuportLookup.borderRadiusTopRight, value, units);			
				}
				
			} else {
			
				if( leftRight === 'left' ) {
					that.setProperty(element, __cssSuportLookup.borderRadiusBottomLeft, value, units);
				} else {
					that.setProperty(element, __cssSuportLookup.borderRadiusBottomRight, value, units);
				}	
			}	
		};

		that.register = function (element) {

			if (element.__animate === undefined) {

				var elementID = __elements.length;
				
				element.__animate = {
					id: elementID,
					state: {},
					callback: {},
					dragging: false
				};

				__elements.push(element);
				return elementID;

			} else {
				return element.__animate.id;
			}
		};

		that.effects = {
			linear: function (t, b, c, d) {
				return c * t / d + b;
			},
			quadIn: function (t, b, c, d) {

				return c * (t /= d) * t + b;
			},
			quadOut: function (t, b, c, d) {

				return -c * (t /= d) * (t - 2) + b;
			},
			quadInOut: function (t, b, c, d) {

				if ((t /= d / 2) < 1) {

					return c / 2 * t * t + b;
				}

				return -c / 2 * ((--t) * (t - 2) - 1) + b;
			},
			cubicIn: function (t, b, c, d) {

				return c * (t /= d) * t * t + b;
			},
			cubicOut: function (t, b, c, d) {

				return c * ((t = t / d - 1) * t * t + 1) + b;
			},
			cubicInOut: function (t, b, c, d) {

				if ((t /= d / 2) < 1) {

					return c / 2 * t * t * t + b;
				}

				return c / 2 * ((t -= 2) * t * t + 2) + b;
			},

			// Copy of cubic
			easeIn: function (t, b, c, d) {

				return c * (t /= d) * t * t + b;
			},
			easeOut: function (t, b, c, d) {

				return c * ((t = t / d - 1) * t * t + 1) + b;
			},
			easeInOut: function (t, b, c, d) {

				if ((t /= d / 2) < 1) {

					return c / 2 * t * t * t + b;
				}

				return c / 2 * ((t -= 2) * t * t + 2) + b;
			},
			// End copy
			quartIn: function (t, b, c, d) {

				return c * (t /= d) * t * t * t + b;
			},
			quartOut: function (t, b, c, d) {

				return -c * ((t = t / d - 1) * t * t * t - 1) + b;
			},
			quartInOut: function (t, b, c, d) {

				if ((t /= d / 2) < 1) {

					return c / 2 * t * t * t * t + b;
				}

				return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
			},
			quintIn: function (t, b, c, d) {

				return c * (t /= d) * t * t * t * t + b;
			},
			quintOut: function (t, b, c, d) {

				return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
			},
			quintInOut: function (t, b, c, d) {

				if ((t /= d / 2) < 1) {
					return c / 2 * t * t * t * t * t + b;
				}

				return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
			},
			sineIn: function (t, b, c, d) {
				return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
			},
			sineOut: function (t, b, c, d) {
				return c * Math.sin(t / d * (Math.PI / 2)) + b;
			},
			sineInOut: function (t, b, c, d) {

				return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
			},
			expoIn: function (t, b, c, d) {

				return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
			},
			expoOut: function (t, b, c, d) {

				return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
			},
			expoInOut: function (t, b, c, d) {

				if (t === 0) { return b; }
				if (t === d) { return b + c; }

				if ((t /= d / 2) < 1) {
					return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
				}

				return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
			},
			circIn: function (t, b, c, d) {

				return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
			},
			circOut: function (t, b, c, d) {

				return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
			},
			circInOut: function (t, b, c, d) {

				if ((t /= d / 2) < 1) {

					return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
				}

				return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
			},
			bounceIn: function (t, b, c, d) {

				return c - that.effects.bounceOut(d - t, 0, c, d) + b;
			},
			bounceOut: function (t, b, c, d) {

				if ((t /= d) < (1 / 2.75)) {
					return c * (7.5625 * t * t) + b;
				} else

				if (t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
				} else

				if (t < (2.5 / 2.75)) {
					return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
				} else {
					return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
				}
			},
			bounceInOut: function (t, b, c, d) {

				if (t < d / 2) {
					return that.effects.bounceIn(t * 2, 0, c, d) * 0.5 + b;
				}

				return that.effects.bounceOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
			},
			elasticIn: function (t, b, c, d, a, p) {

				if (t === 0) { return b; }

				if ((t /= d) === 1) {
					return b + c;
				}

				if (!p) {
					p = d * 0.3;
				}

				if (!a) {
					a = 1;
				}
				var s = 0;

				if (a < Math.abs(c)) {
					a = c;
					s = p / 4;
				} else {
					s = p / (2 * Math.PI) * Math.asin(c / a);
				}

				return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			},
			elasticOut: function (t, b, c, d, a, p) {

				if (t === 0) {
					return b;
				}

				if ((t /= d) === 1) {
					return b + c;
				}

				if (!p) {
					p = d * 0.3;
				}

				if (!a) {
					a = 1;
				}
				var s = 0;

				if (a < Math.abs(c)) {
					a = c;
					s = p / 4;
				} else {
					s = p / (2 * Math.PI) * Math.asin(c / a);
				}

				return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
			},
			elasticInOut: function (t, b, c, d, a, p) {

				if (t === 0) {
					return b;
				}

				if ((t /= d / 2) === 2) {
					return b + c;
				}

				if (!p) {
					p = d * (0.3 * 1.5);
				}

				if (!a) {
					a = 1;
				}
				var s = 0;

				if (a < Math.abs(c)) {
					a = c;
					s = p / 4;
				} else {
					s = p / (2 * Math.PI) * Math.asin(c / a);
				}

				if (t < 1) {

					return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
				}

				return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
			}
		};

	that.init();

	return that;
	
}( JSTween || {} ) );