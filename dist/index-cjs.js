'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function useMouseEvents(mouseDownHandler, mouseMoveHandler, mouseUpHandler) {
    return function mouseEventsHandler(event) {
        var positions = mouseDownHandler(event);

        function onMouseMove(event) {
            positions = mouseMoveHandler(event, positions) || positions;
        }

        window.addEventListener('mousemove', onMouseMove);

        window.addEventListener('mouseup', function (event) {
            window.removeEventListener('mousemove', onMouseMove);

            mouseUpHandler && mouseUpHandler(event, positions);
        }, { once: true });
    };
}

/* eslint react-hooks/exhaustive-deps: 0 */

var useMount = function (effect) { return React.useEffect(effect, []); };

function rgbToHSv(ref) {
    var red = ref.red;
    var green = ref.green;
    var blue = ref.blue;

    var rr;
    var gg;
    var bb;
    var h;
    var s;

    var rabs = red / 255;
    var gabs = green / 255;
    var babs = blue / 255;
    var v = Math.max(rabs, gabs, babs);
    var diff = v - Math.min(rabs, gabs, babs);
    var diffc = function (c) { return (v - c) / 6 / diff + 1 / 2; };
    if (diff === 0) {
        h = 0;
        s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        } else if (h > 1) {
            h -= 1;
        }
    }

    return {
        hue: Math.round(h * 360),
        saturation: Math.round(s * 100),
        value: Math.round(v * 100),
    };
}

function getRgbByHue(hue) {
    var C = 1;
    var H = hue / 60;
    var X = C * (1 - Math.abs(H % 2 - 1));
    var m = 0;
    var precision = 255;
    var r = 0;
    var g = 0;
    var b = 0;

    C = (C + m) * precision | 0;
    X = (X + m) * precision | 0;

    if (H >= 0 && H < 1) {
        r = C | 0;
        g = X | 0;
        b = m | 0;
    }
    if (H >= 1 && H < 2) {
        r = X | 0;
        g = C | 0;
        b = m | 0;
    }
    if (H >= 2 && H < 3) {
        r = m | 0;
        g = C | 0;
        b = X | 0;
    }
    if (H >= 3 && H < 4) {
        r = m | 0;
        g = X | 0;
        b = C | 0;
    }
    if (H >= 4 && H < 5) {
        r = X | 0;
        g = m | 0;
        b = C | 0;
    }
    if (H >= 5 && H <= 6) {
        r = C | 0;
        g = m | 0;
        b = X | 0;
    }

    return {
        red: r,
        green: g,
        blue: b,
    };
}

function isValidRGBValue(value) {
    return (typeof (value) === 'number' && Number.isNaN(value) === false && value >= 0 && value <= 255);
}

function setRGBA(red, green, blue, alpha) {
    if (isValidRGBValue(red) && isValidRGBValue(green) && isValidRGBValue(blue)) {
        var color = {
            red: red | 0,
            green: green | 0,
            blue: blue | 0,
        };

        if (isValidRGBValue(alpha) === true) {
            color.alpha = alpha | 0;
        }

        // RGBToHSL(color.r, color.g, color.b);

        return color;
    }
}

function hsvToRgb(hue, saturation, value) {
    value /= 100;
    var sat = saturation / 100;
    var C = sat * value;
    var H = hue / 60;
    var X = C * (1 - Math.abs(H % 2 - 1));
    var m = value - C;
    var precision = 255;

    C = (C + m) * precision | 0;
    X = (X + m) * precision | 0;
    m = m * precision | 0;

    if (H >= 1 && H < 2) {
        return setRGBA(X, C, m);
    }
    if (H >= 2 && H < 3) {
        return setRGBA(m, C, X);
    }
    if (H >= 3 && H < 4) {
        return setRGBA(m, X, C);
    }
    if (H >= 4 && H < 5) {
        return setRGBA(X, m, C);
    }
    if (H >= 5 && H <= 6) {
        return setRGBA(C, m, X);
    }

    return setRGBA(C, X, m);
}

function changePicker(x, y, height, width, hue) {
    if (x > width) { x = width; }
    if (y > height) { y = height; }
    if (x < 0) { x = 0; }
    if (y < 0) { y = 0; }
    var value = 100 - (y * 100 / height) | 0;
    var saturation = x * 100 / width | 0;
    return Object.assign({}, hsvToRgb(hue, saturation, value),
        {saturation: saturation,
        value: value});
}

function getHue(offsetX, width, saturation, value) {
    var hue = ((360 * offsetX) / width) | 0;

    hue = hue < 0 ? 0 : hue > 360 ? 360 : hue;

    return Object.assign({}, hsvToRgb(hue, saturation, value),
        {hue: hue});
}

function getAlpha(value, width) {
    value = Number((value / width).toFixed(2));

    return value > 1 ? 1 : value < 0 ? 0 : value;
}

function rgbToHex(red, green, blue) {
    var r16 = red.toString(16);
    var g16 = green.toString(16);
    var b16 = blue.toString(16);

    if (red < 16) { r16 = "0" + r16; }
    if (green < 16) { g16 = "0" + g16; }
    if (blue < 16) { b16 = "0" + b16; }

    return r16 + g16 + b16;
}

var hexRegexp = /(^#{0,1}[0-9A-F]{6}$)|(^#{0,1}[0-9A-F]{3}$)|(^#{0,1}[0-9A-F]{8}$)/i;

var regexp = /([0-9A-F])([0-9A-F])([0-9A-F])/i;

function hexToRgb(value) {
    var valid = hexRegexp.test(value);

    if (valid) {
        if (value[0] === '#') { value = value.slice(1, value.length); }

        if (value.length === 3) { value = value.replace(regexp, '$1$1$2$2$3$3'); }

        var red = parseInt(value.substr(0, 2), 16);
        var green = parseInt(value.substr(2, 2), 16);
        var blue = parseInt(value.substr(4, 2), 16);
        var alpha = parseInt(value.substr(6, 2), 16) / 255;

        var color = setRGBA(red, green, blue, alpha);
        var hsv = rgbToHSv(Object.assign({}, color));

        return Object.assign({}, color,
            hsv);
    }

    return false;
}

function updateGradientActivePercent(offsetX, width) {
    var leftPercent = (offsetX * 100) / width;
    return leftPercent < 0 ? 0 : leftPercent > 100 ? 100 : leftPercent;
}

function calculateDegree(x, y, centerX, centerY) {
    var radians = Math.atan2(x - centerX, y - centerY);
    return (radians * (180 / Math.PI) * -1) + 180;
}

function getRightValue(newValue, oldValue) {
    return (!newValue && newValue !== 0) ? oldValue : newValue;
}

function generateSolidStyle(red, green, blue, alpha) {
    return ("rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")");
}

function generateGradientStyle(points, type, degree) {
    var style = '';
    var sortedPoints = points.slice();

    sortedPoints.sort(function (a, b) { return a.left - b.left; });

    if (type === 'linear') {
        style = "linear-gradient(" + degree + "deg,";
    } else {
        style = 'radial-gradient(';
    }

    sortedPoints.forEach(function (point, index) {
        style += "rgba(" + (point.red) + ", " + (point.green) + ", " + (point.blue) + ", " + (point.alpha) + ") " + (point.left) + "%";

        if (index !== sortedPoints.length - 1) {
            style += ',';
        }
    });

    style += ')';
    return style;
}

function Picking(ref) {
    var red = ref.red;
    var green = ref.green;
    var blue = ref.blue;
    var hue = ref.hue;
    var saturation = ref.saturation;
    var value = ref.value;
    var updateRgb = ref.updateRgb;

    var pickingAreaRef = React.useRef();
    var ref$1 = React.useState(0);
    var width = ref$1[0];
    var setWidth = ref$1[1];
    var ref$2 = React.useState(0);
    var height = ref$2[0];
    var setHeight = ref$2[1];

    React.useEffect(function () {
        if (pickingAreaRef.current) {
            setWidth(pickingAreaRef.current.clientWidth);
            setHeight(pickingAreaRef.current.clientHeight);
        }
    }, [pickingAreaRef, setWidth, setHeight]);

    React.useEffect(function () {
        var ref = getRgbByHue(hue);
        var red = ref.red;
        var green = ref.green;
        var blue = ref.blue;

        pickingAreaRef.current.style.backgroundColor = "rgb(" + red + ", " + green + ", " + blue + ")";
    }, [hue]);

    // generate offsetLeft by saturation
    var offsetLeft = ((saturation * width / 100) | 0) - 6;

    // generate offsetTop by value
    var offsetTop = (height - (value * height / 100) | 0) - 6;

    var getPointerStyle = {
        backgroundColor: ("rgb(" + red + ", " + green + ", " + blue + ")"),
        left: (offsetLeft + "px"),
        top: (offsetTop + "px"),
    };

    var mouseDownHandler = React.useCallback(function (event) {
        var elementX = event.currentTarget.getBoundingClientRect().x;
        var elementY = event.currentTarget.getBoundingClientRect().y;
        var startX = event.pageX;
        var startY = event.pageY;
        var positionX = startX - elementX;
        var positionY = startY - elementY;

        var color = changePicker(positionX, positionY, height, width, hue);

        updateRgb(color, 'onStartChange');
        return {
            startX: startX,
            startY: startY,
            positionX: positionX,
            positionY: positionY,

        };
    }, [height, width, hue, updateRgb]);

    var changeObjectPositions = React.useCallback(function (event, ref) {
        var startX = ref.startX;
        var startY = ref.startY;
        var positionX = ref.positionX;
        var positionY = ref.positionY;

        var moveX = event.pageX - startX;
        var moveY = event.pageY - startY;
        positionX += moveX;
        positionY += moveY;

        var color = changePicker(positionX, positionY, height, width, hue);

        return {
            positions: {
                positionX: positionX,
                positionY: positionY,
                startX: event.pageX,
                startY: event.pageY,
            },
            color: color,
        };
    }, [height, hue, width]);

    var mouseMoveHandler = React.useCallback(function (event, ref) {
        var startX = ref.startX;
        var startY = ref.startY;
        var positionX = ref.positionX;
        var positionY = ref.positionY;

        var ref$1 = changeObjectPositions(event, {
            startX: startX, startY: startY, positionX: positionX, positionY: positionY,
        });
        var positions = ref$1.positions;
        var color = ref$1.color;

        updateRgb(color, 'onChange');

        return positions;
    }, [updateRgb, changeObjectPositions]);

    var mouseUpHandler = React.useCallback(function (event, ref) {
        var startX = ref.startX;
        var startY = ref.startY;
        var positionX = ref.positionX;
        var positionY = ref.positionY;

        var ref$1 = changeObjectPositions(event, {
            startX: startX, startY: startY, positionX: positionX, positionY: positionY,
        });
        var positions = ref$1.positions;
        var color = ref$1.color;

        updateRgb(color, 'onEndChange');

        return positions;
    }, [updateRgb, changeObjectPositions]);

    var mouseEvents = useMouseEvents(mouseDownHandler, mouseMoveHandler, mouseUpHandler);

    var onMouseDown = function (event) {
        mouseEvents(event);
    };

    return (
        React__default['default'].createElement( 'div', {
            className: "picking-area", ref: pickingAreaRef, onMouseDown: onMouseDown }, 
            React__default['default'].createElement( 'div', { className: "picking-area-overlay1" }, 
                React__default['default'].createElement( 'div', { className: "picking-area-overlay2" }, 
                    React__default['default'].createElement( 'div', { className: "picker-pointer", style: getPointerStyle })
                )
            )
        )
    );
}

function Preview(ref) {
    var red = ref.red;
    var green = ref.green;
    var blue = ref.blue;
    var alpha = ref.alpha;
    var isGradient = ref.isGradient;
    var points = ref.points;
    var gradientType = ref.gradientType;
    var gradientDegree = ref.gradientDegree;

    var ref$1 = React.useState({});
    var style = ref$1[0];
    var setStyle = ref$1[1];

    React.useEffect(function () {
        if (isGradient) {
            var style$1 = generateGradientStyle(points, gradientType, gradientDegree);

            setStyle({ background: style$1 });

            return;
        }

        var style = generateSolidStyle(red, green, blue, alpha);

        setStyle({ backgroundColor: style });
    }, [points, gradientDegree, gradientType, isGradient, red, green, blue, alpha]);

    return (
        React__default['default'].createElement( 'div', { className: "preview-area" }, 
            React__default['default'].createElement( 'div', { className: "preview-box", style: style })
        )
    );
}

function Hue(ref) {
    var hue = ref.hue;
    var saturation = ref.saturation;
    var value = ref.value;
    var updateRgb = ref.updateRgb;

    var hueRef = React.useRef();
    var ref$1 = React.useState(0);
    var width = ref$1[0];
    var setWidth = ref$1[1];

    React.useEffect(function () {
        if (hueRef.current) {
            setWidth(hueRef.current.clientWidth);
        }
    }, [setWidth]);

    var mouseDownHandler = React.useCallback(function (event) {
        var elementX = event.currentTarget.getBoundingClientRect().x;
        var startX = event.pageX;
        var positionX = startX - elementX;

        var color = getHue(positionX, width, saturation, value);

        updateRgb(color, 'onStartChange');

        return {
            startX: startX,
            positionX: positionX,
        };
    }, [width, saturation, value, updateRgb]);

    var changeObjectPositions = React.useCallback(function (event, ref) {
        var startX = ref.startX;
        var positionX = ref.positionX;

        var moveX = event.pageX - startX;
        positionX += moveX;

        // update value and saturation
        var offsetX = positionX > width ? width : positionX <= 0 ? 0 : positionX;
        var color = getHue(offsetX, width, saturation, value);

        return {
            positions: {
                positionX: positionX,
                startX: event.pageX,
            },
            color: color,
        };
    }, [width, saturation, value]);

    var mouseMoveHandler = React.useCallback(function (event, ref) {
        var startX = ref.startX;
        var positionX = ref.positionX;

        var ref$1 = changeObjectPositions(event, { startX: startX, positionX: positionX });
        var positions = ref$1.positions;
        var color = ref$1.color;

        updateRgb(color, 'onChange');

        return positions;
    }, [changeObjectPositions, updateRgb]);

    var mouseUpHandler = React.useCallback(function (event, ref) {
        var startX = ref.startX;
        var positionX = ref.positionX;

        var ref$1 = changeObjectPositions(event, { startX: startX, positionX: positionX });
        var positions = ref$1.positions;
        var color = ref$1.color;

        updateRgb(color, 'onEndChange');

        return positions;
    }, [changeObjectPositions, updateRgb]);

    var mouseEvents = useMouseEvents(mouseDownHandler, mouseMoveHandler, mouseUpHandler);

    var onMouseDown = function (event) {
        mouseEvents(event);
    };

    var offsetLeft = ((hue * width / 360) | 0) - 6;

    var pointerStyle = {
        left: (offsetLeft + "px"),
    };

    return (
        React__default['default'].createElement( 'div', {
            className: "hue", onMouseDown: onMouseDown }, 
            React__default['default'].createElement( 'div', { className: "hue-area", ref: hueRef }, 
                React__default['default'].createElement( 'div', {
                    className: "picker-pointer", style: pointerStyle })
            )
        )
    );
}

function Alpha(ref) {
    var red = ref.red;
    var green = ref.green;
    var blue = ref.blue;
    var alpha = ref.alpha;
    var updateRgb = ref.updateRgb;

    var alphaMaskRef = React.useRef();
    var ref$1 = React.useState(0);
    var width = ref$1[0];
    var setWidth = ref$1[1];

    React.useEffect(function () {
        if (alphaMaskRef.current) {
            setWidth(alphaMaskRef.current.clientWidth);
        }
    }, [setWidth]);

    var mouseDownHandler = React.useCallback(function (event) {
        var elementX = event.currentTarget.getBoundingClientRect().x;
        var startX = event.pageX;
        var positionX = startX - elementX;

        updateRgb({ alpha: getAlpha(positionX, width) }, 'onStartChange');
        return {
            startX: startX,
            positionX: positionX,

        };
    }, [width, updateRgb]);

    var changeObjectPositions = React.useCallback(function (event, ref) {
        var startX = ref.startX;
        var positionX = ref.positionX;

        var moveX = event.pageX - startX;
        positionX += moveX;

        var alpha = getAlpha(positionX, width);

        return {
            positions: {
                positionX: positionX,
                startX: event.pageX,
            },
            alpha: alpha,
        };
    }, [width]);

    var mouseMoveHandler = React.useCallback(function (event, ref) {
        var startX = ref.startX;
        var positionX = ref.positionX;

        var ref$1 = changeObjectPositions(event, { startX: startX, positionX: positionX });
        var positions = ref$1.positions;
        var alpha = ref$1.alpha;

        updateRgb({ alpha: alpha }, 'onChange');

        return positions;
    }, [changeObjectPositions, updateRgb]);

    var mouseUpHandler = React.useCallback(function (event, ref) {
        var startX = ref.startX;
        var positionX = ref.positionX;

        var ref$1 = changeObjectPositions(event, { startX: startX, positionX: positionX });
        var positions = ref$1.positions;
        var alpha = ref$1.alpha;

        updateRgb({ alpha: alpha }, 'onEndChange');

        return positions;
    }, [changeObjectPositions, updateRgb]);

    var mouseEvents = useMouseEvents(mouseDownHandler, mouseMoveHandler, mouseUpHandler);

    var onMouseDown = function (event) {
        mouseEvents(event);
    };

    var style = {
        background: ("linear-gradient(to right, rgba(0, 0, 0, 0), rgb(" + red + ", " + green + ", " + blue + "))"),
    };

    var offsetLeft = ((alpha * width) | 0) - 6;

    var pointerStyle = {
        left: (offsetLeft + "px"),
    };

    return (
        React__default['default'].createElement( 'div', {
            onMouseDown: onMouseDown, className: "alpha" }, 
            React__default['default'].createElement( 'div', { className: "gradient", style: style }), 
            React__default['default'].createElement( 'div', { className: "alpha-area" }, 
                React__default['default'].createElement( 'div', { className: "alpha-mask", ref: alphaMaskRef }, 
                    React__default['default'].createElement( 'div', { className: "picker-pointer", style: pointerStyle })
                )
            )
        )
    );
}

function GradientPoint(ref) {
    var point = ref.point;
    var activePointIndex = ref.activePointIndex;
    var index = ref.index;
    var width = ref.width;
    var positions = ref.positions;
    var changeActivePointIndex = ref.changeActivePointIndex;
    var updateGradientLeft = ref.updateGradientLeft;
    var removePoint = ref.removePoint;

    var activeClassName = activePointIndex === index ? ' active' : '';

    var pointStyle = {
        left: (((point.left * (width / 100)) - 6) + "px"),
    };

    var mouseDownHandler = React.useCallback(function (event) {
        changeActivePointIndex(index);

        var startX = event.pageX;
        var startY = event.pageY;
        var offsetX = startX - positions.x;

        updateGradientLeft(point.left, index, 'onStartChange');

        return {
            startX: startX,
            startY: startY,
            offsetX: offsetX,

        };
    }, [point.left, index, positions, changeActivePointIndex, updateGradientLeft]);

    var changeObjectPositions = React.useCallback(function (event, ref) {
        var startX = ref.startX;
        var offsetX = ref.offsetX;

        var moveX = event.pageX - startX;
        offsetX += moveX;
        // update point percent
        var left = updateGradientActivePercent(offsetX, width);

        return {
            positions: {
                offsetX: offsetX,
                startX: event.pageX,
            },
            left: left,
        };
    }, [width]);

    var mouseMoveHandler = React.useCallback(function (event, ref) {
        var startX = ref.startX;
        var offsetX = ref.offsetX;

        var ref$1 = changeObjectPositions(event, { startX: startX, offsetX: offsetX });
        var positions = ref$1.positions;
        var left = ref$1.left;

        updateGradientLeft(left, index, 'onChange');

        return positions;
    }, [index, changeObjectPositions, updateGradientLeft]);

    var mouseUpHandler = React.useCallback(function (event, ref) {
        var startX = ref.startX;
        var offsetX = ref.offsetX;

        var ref$1 = changeObjectPositions(event, { startX: startX, offsetX: offsetX });
        var positions = ref$1.positions;
        var left = ref$1.left;

        updateGradientLeft(left, index, 'onEndChange');

        return positions;
    }, [index, changeObjectPositions, updateGradientLeft]);

    var mouseEvents = useMouseEvents(mouseDownHandler, mouseMoveHandler, mouseUpHandler);

    var onMouseDown = function (event) {
        changeActivePointIndex(index);
        mouseEvents(event);
    };

    var pointerClickHandler = function (event) {
        event.stopPropagation();
    };

    return (
        React__default['default'].createElement( 'div', {
            className: ("picker-pointer" + activeClassName), onClick: pointerClickHandler, style: pointStyle, onMouseDown: onMouseDown, onDoubleClick: function () { return removePoint(index); } }, 
            React__default['default'].createElement( 'span', { className: ("child-point" + activeClassName) })
        )
    );
}

function GradientPoints(ref) {
    var points = ref.points;
    var activePointIndex = ref.activePointIndex;
    var changeActivePointIndex = ref.changeActivePointIndex;
    var updateGradientLeft = ref.updateGradientLeft;
    var addPoint = ref.addPoint;
    var removePoint = ref.removePoint;

    var ref$1 = React.useState({});
    var pointsStyle = ref$1[0];
    var setpointsStyle = ref$1[1];
    var ref$2 = React.useState(0);
    var width = ref$2[0];
    var setWidth = ref$2[1];
    var ref$3 = React.useState({});
    var positions = ref$3[0];
    var setPositions = ref$3[1];

    var pointsContainerRef = React.useRef();


    React.useEffect(function () {
        if (pointsContainerRef.current) {
            setWidth(pointsContainerRef.current.clientWidth);

            var pointerPos = pointsContainerRef.current.getBoundingClientRect();
            setPositions({ x: pointerPos.x, y: pointerPos.y });
        }
    }, []);
    React.useEffect(function () {
        var style = generateGradientStyle(points, 'linear', 90);

        setpointsStyle({ background: style });
    }, [points]);


    var pointsContainerClick = React.useCallback(function (event) {
        var left = updateGradientActivePercent(event.pageX - positions.x, width);

        addPoint(left);
    }, [addPoint, positions.x, width]);

    var pointsContainer = function () { return (
        React__default['default'].createElement( 'div', {
            className: "gradient-slider-container", ref: pointsContainerRef }, 
            points && points.map(function (point, index) { return (
                    React__default['default'].createElement( GradientPoint, {
                        key: index, activePointIndex: activePointIndex, index: index, point: point, width: width, positions: positions, changeActivePointIndex: changeActivePointIndex, updateGradientLeft: updateGradientLeft, removePoint: removePoint })
                ); })
        )
    ); };

    return (
        React__default['default'].createElement( 'div', {
            className: "gradient", style: pointsStyle, onClick: pointsContainerClick }, 
            pointsContainer()
        )


    );
}

function Area(ref) {
    var red = ref.red;
    var green = ref.green;
    var blue = ref.blue;
    var alpha = ref.alpha;
    var hue = ref.hue;
    var saturation = ref.saturation;
    var value = ref.value;
    var isGradient = ref.isGradient;
    var type = ref.type;
    var degree = ref.degree;
    var points = ref.points;
    var activePointIndex = ref.activePointIndex;
    var updateRgb = ref.updateRgb;
    var changeActivePointIndex = ref.changeActivePointIndex;
    var updateGradientLeft = ref.updateGradientLeft;
    var addPoint = ref.addPoint;
    var removePoint = ref.removePoint;

    return (
        React__default['default'].createElement( 'div', { className: "picker-area" }, 
            React__default['default'].createElement( Picking, {
                red: red, green: green, blue: blue, hue: hue, saturation: saturation, value: value, updateRgb: updateRgb }), 

            isGradient
                && (
                    React__default['default'].createElement( GradientPoints, {
                        type: type, degree: degree, points: points, activePointIndex: activePointIndex, changeActivePointIndex: changeActivePointIndex, updateGradientLeft: updateGradientLeft, addPoint: addPoint, removePoint: removePoint })
                ), 

            React__default['default'].createElement( 'div', { className: "preview" }, 
                React__default['default'].createElement( Preview, {
                    red: red, green: green, blue: blue, alpha: alpha, points: points, gradientDegree: degree, gradientType: type, isGradient: isGradient }), 

                React__default['default'].createElement( 'div', { className: "color-hue-alpha" }, 
                    React__default['default'].createElement( Hue, {
                        hue: hue, saturation: saturation, value: value, updateRgb: updateRgb }), 
                    React__default['default'].createElement( Alpha, {
                        alpha: alpha, red: red, green: green, blue: blue, updateRgb: updateRgb })
                )
            )
        )
    );
}

function Input(ref) {
    var value = ref.value;
    var label = ref.label;
    var type = ref.type; if ( type === void 0 ) type = 'text';
    var onChange = ref.onChange;
    var onFocus = ref.onFocus;
    var onBlur = ref.onBlur;
    var classes = ref.classes;

    return (
        React__default['default'].createElement( 'div', { className: ("input-field " + classes) }, 
            React__default['default'].createElement( 'div', { className: "input-container" }, 
                React__default['default'].createElement( 'input', {
                    className: (type + "-input input"), value: value, onChange: onChange, onFocus: onFocus, onBlur: onBlur })
            ), 
            React__default['default'].createElement( 'div', { className: "label" }, 
                label
            )
        )
    );
}

function Hex(ref) {
    var red = ref.red;
    var green = ref.green;
    var blue = ref.blue;
    var updateRgb = ref.updateRgb;

    var ref$1 = React.useState('');
    var hexValue = ref$1[0];
    var setHexValue = ref$1[1];
    var ref$2 = React.useState(false);
    var progress = ref$2[0];
    var setProgress = ref$2[1];

    React.useEffect(function () {
        if (progress) {
            return;
        }
        var hex = rgbToHex(red, green, blue);

        setHexValue(hex);
    }, [red, green, blue, progress]);

    var changeHex = React.useCallback(function (event) {
        setHexValue(event.target.value);
        var color = hexToRgb(event.target.value);

        if (color) {
            updateRgb(color);
        }
    }, [setHexValue, updateRgb]);

    return (
        React__default['default'].createElement( Input, {
            value: hexValue, label: "hex", onChange: changeHex, onFocus: function () { return setProgress(true); }, onBlur: function () { return setProgress(false); }, classes: "hex" })
    );
}

function RGBItem(ref) {
    var value = ref.value;
    var type = ref.type;
    var label = ref.label;
    var onChange = ref.onChange;

    var ref$1 = React.useState(value);
    var inputValue = ref$1[0];
    var setInputValue = ref$1[1];

    React.useEffect(function () {
        if (value !== +inputValue && inputValue !== '') {
            setInputValue(value);
        }
    }, [inputValue, value]);

    var onChangeHandler = React.useCallback(function (event) {
        var value = +event.target.value;

        if (Number.isNaN(value) || value.length > 3 || value < 0 || value > 255) {
            return;
        }
        setInputValue(event.target.value);

        onChange(value);
    }, [onChange]);

    var onBlur = React.useCallback(function () {
        !inputValue && inputValue !== 0 && setInputValue(value);
    }, [inputValue, setInputValue, value]);

    return (
        React__default['default'].createElement( Input, {
            value: inputValue, type: type, label: label, onChange: onChangeHandler, onBlur: onBlur, classes: "rgb" })
    );
}

function RGB(ref) {
    var red = ref.red;
    var green = ref.green;
    var blue = ref.blue;
    var alpha = ref.alpha;
    var updateRgb = ref.updateRgb;

    var changeValue = React.useCallback(function (field, value) {
        var obj, obj$1;

        if (field === 'alpha') {
            updateRgb({ alpha: value / 100 });

            return;
        }

        var color = rgbToHSv(( obj = {
            red: red, green: green, blue: blue
        }, obj[field] = value, obj ));

        updateRgb(Object.assign({}, color, ( obj$1 = {}, obj$1[field] = value, obj$1 )));
    }, [red, green, blue, updateRgb]);

    return (
        React__default['default'].createElement( React__default['default'].Fragment, null, 
            React__default['default'].createElement( RGBItem, {
                value: red, type: "number", label: "R", onChange: function (value) { return changeValue('red', value); } }), 

            React__default['default'].createElement( RGBItem, {
                value: green, type: "number", label: "G", onChange: function (value) { return changeValue('green', value); } }), 

            React__default['default'].createElement( RGBItem, {
                value: blue, type: "number", label: "B", onChange: function (value) { return changeValue('blue', value); } }), 

            React__default['default'].createElement( RGBItem, {
                value: parseInt(alpha * 100, 10), type: "number", label: "alpha", onChange: function (value) { return changeValue('alpha', value); } })
        )
    );
}

function Preview$1(ref) {
    var red = ref.red;
    var green = ref.green;
    var blue = ref.blue;
    var alpha = ref.alpha;
    var updateRgb = ref.updateRgb;

    return (
        React__default['default'].createElement( 'div', { className: "color-preview-area" }, 
            React__default['default'].createElement( 'div', { className: "input-group" }, 
                React__default['default'].createElement( Hex, {
                    red: red, green: green, blue: blue, updateRgb: updateRgb }), 

                React__default['default'].createElement( RGB, {
                    red: red, green: green, blue: blue, alpha: alpha, updateRgb: updateRgb })
            )
        )
    );
}

function Solid(ref) {
    var red = ref.red;
    var green = ref.green;
    var blue = ref.blue;
    var alpha = ref.alpha;
    var onChange = ref.onChange;
    var onStartChange = ref.onStartChange;
    var onEndChange = ref.onEndChange;

    var ref$1 = React.useState(red);
    var colorRed = ref$1[0];
    var setColorRed = ref$1[1];
    var ref$2 = React.useState(green);
    var colorGreen = ref$2[0];
    var setColorGreen = ref$2[1];
    var ref$3 = React.useState(blue);
    var colorBlue = ref$3[0];
    var setColorBlue = ref$3[1];
    var ref$4 = React.useState(alpha);
    var colorAlpha = ref$4[0];
    var setColorAlpha = ref$4[1];
    var ref$5 = React.useState(0);
    var colorHue = ref$5[0];
    var setColorHue = ref$5[1];
    var ref$6 = React.useState(100);
    var colorSaturation = ref$6[0];
    var setColorSaturation = ref$6[1];
    var ref$7 = React.useState(100);
    var colorValue = ref$7[0];
    var setColorValue = ref$7[1];

    var actions = {
        onChange: onChange,
        onStartChange: onStartChange,
        onEndChange: onEndChange,
    };

    useMount(function () {
        var ref = rgbToHSv({ red: colorRed, green: colorGreen, blue: colorBlue });
        var hue = ref.hue;
        var saturation = ref.saturation;
        var value = ref.value;

        setColorHue(hue);
        setColorSaturation(saturation);
        setColorValue(value);
    });

    var updateColor = React.useCallback(function (ref, actionName) {
        var red = ref.red;
        var green = ref.green;
        var blue = ref.blue;
        var alpha = ref.alpha;
        var hue = ref.hue;
        var saturation = ref.saturation;
        var value = ref.value;
        if ( actionName === void 0 ) actionName = 'onChange';

        red = getRightValue(red, colorRed);
        green = getRightValue(green, colorGreen);
        blue = getRightValue(blue, colorBlue);
        alpha = getRightValue(alpha, colorAlpha);
        hue = getRightValue(hue, colorHue);
        saturation = getRightValue(saturation, colorSaturation);
        value = getRightValue(value, colorValue);

        setColorRed(red);
        setColorGreen(green);
        setColorBlue(blue);
        setColorAlpha(alpha);
        setColorHue(hue);
        setColorSaturation(saturation);
        setColorValue(value);

        var action = actions[actionName];

        action && action({
            red: red,
            green: green,
            blue: blue,
            alpha: alpha,
            hue: hue,
            saturation: saturation,
            value: value,
            style: generateSolidStyle(red, green, blue, alpha),
        });
    }, [
        colorRed, colorGreen, colorBlue, colorAlpha,
        colorHue, colorSaturation, colorValue,
        actions ]);

    return (
        React__default['default'].createElement( React__default['default'].Fragment, null, 
            React__default['default'].createElement( Area, {
                red: colorRed, green: colorGreen, blue: colorBlue, alpha: colorAlpha, hue: colorHue, saturation: colorSaturation, value: colorValue, updateRgb: updateColor }), 
            React__default['default'].createElement( Preview$1, {
                red: colorRed, green: colorGreen, blue: colorBlue, alpha: colorAlpha, updateRgb: updateColor })
        )
    );
}

Solid.defaultProps = {
    red: 255,
    green: 0,
    blue: 0,
    alpha: 1,
};

function GradientControls(ref) {
    var type = ref.type;
    var degree = ref.degree;
    var changeGradientControl = ref.changeGradientControl;

    var ref$1 = React.useState(false);
    var disableClick = ref$1[0];
    var setDisableClick = ref$1[1];

    var onClickGradientDegree = React.useCallback(function () {
        if (disableClick) {
            setDisableClick(false);
            return;
        }

        var gradientDegree = degree + 45;

        if (gradientDegree >= 360) {
            gradientDegree = 0;
        }

        changeGradientControl({ degree: parseInt(gradientDegree, 10) });
    }, [disableClick, degree, changeGradientControl]);

    var mouseDownHandler = React.useCallback(function (event) {
        var pointer = event.target;
        var pointerBox = pointer.getBoundingClientRect();
        var centerY = pointerBox.top + parseInt(8 - window.pageYOffset, 10);
        var centerX = pointerBox.left + parseInt(8 - window.pageXOffset, 10);

        return {
            centerY: centerY,
            centerX: centerX,

        };
    }, []);

    var mouseMoveHandler = React.useCallback(function (event, ref) {
        var centerX = ref.centerX;
        var centerY = ref.centerY;

        setDisableClick(true);

        var newDegree = calculateDegree(event.clientX, event.clientY, centerX, centerY);

        changeGradientControl({ degree: parseInt(newDegree, 10) });

        return { centerX: centerX, centerY: centerY };
    }, [changeGradientControl]);

    var mouseUpHandler = function (event) {
        var targetClasses = event.target.classList;

        if (targetClasses.contains('gradient-degrees') || targetClasses.contains('icon-rotate')) {
            return;
        }

        setDisableClick(false);
    };

    var mouseEvents = useMouseEvents(mouseDownHandler, mouseMoveHandler, mouseUpHandler);

    var onMouseDown = function (event) {
        mouseEvents(event);
    };

    var degreesStyle = {
        transform: ("rotate(" + degree + "deg)"),
    };

    return (
        React__default['default'].createElement( 'div', { className: "gradient-controls" }, 
            React__default['default'].createElement( 'div', { className: "gradient-type" }, 
                React__default['default'].createElement( 'div', {
                    className: ("gradient-type-item liner-gradient " + (type === 'linear' ? 'active' : '')), onClick: function () { return changeGradientControl({ type: 'linear' }); } }), 
                React__default['default'].createElement( 'div', {
                    className: ("gradient-type-item radial-gradient " + (type === 'radial' ? 'active' : '')), onClick: function () { return changeGradientControl({ type: 'radial' }); } })
            ), 
            type === 'linear'
                && (
                    React__default['default'].createElement( 'div', { className: "gradient-degrees-options" }, 
                        React__default['default'].createElement( 'div', {
                            className: "gradient-degrees", onMouseDown: onMouseDown, onClick: onClickGradientDegree }, 
                            React__default['default'].createElement( 'div', { className: "gradient-degree-center", style: degreesStyle }, 
                                React__default['default'].createElement( 'div', { className: "gradient-degree-pointer" })
                            )
                        ), 
                        React__default['default'].createElement( 'div', { className: "gradient-degree-value" }, 
                            React__default['default'].createElement( 'p', null, 
                                degree, "°" )
                        )
                    )
                )
        )
    );
}

function Gradient(ref) {
    var points = ref.points;
    var type = ref.type;
    var degree = ref.degree;
    var onChange = ref.onChange;
    var onStartChange = ref.onStartChange;
    var onEndChange = ref.onEndChange;

    var ref$1 = React.useState(0);
    var activePointIndex = ref$1[0];
    var setActivePointIndex = ref$1[1];
    var ref$2 = React.useState(points);
    var gradientPoints = ref$2[0];
    var setGradientPoints = ref$2[1];
    var ref$3 = React.useState(gradientPoints[0]);
    var activePoint = ref$3[0];
    var setActivePoint = ref$3[1];
    var ref$4 = React.useState(activePoint.red);
    var colorRed = ref$4[0];
    var setColorRed = ref$4[1];
    var ref$5 = React.useState(activePoint.green);
    var colorGreen = ref$5[0];
    var setColorGreen = ref$5[1];
    var ref$6 = React.useState(activePoint.blue);
    var colorBlue = ref$6[0];
    var setColorBlue = ref$6[1];
    var ref$7 = React.useState(activePoint.alpha);
    var colorAlpha = ref$7[0];
    var setColorAlpha = ref$7[1];
    var ref$8 = React.useState(0);
    var colorHue = ref$8[0];
    var setColorHue = ref$8[1];
    var ref$9 = React.useState(100);
    var colorSaturation = ref$9[0];
    var setColorSaturation = ref$9[1];
    var ref$10 = React.useState(100);
    var colorValue = ref$10[0];
    var setColorValue = ref$10[1];
    var ref$11 = React.useState(type);
    var gradientType = ref$11[0];
    var setGradientType = ref$11[1];
    var ref$12 = React.useState(degree);
    var gradientDegree = ref$12[0];
    var setGradientDegree = ref$12[1];

    var actions = {
        onChange: onChange,
        onStartChange: onStartChange,
        onEndChange: onEndChange,
    };

    useMount(function () {
        var ref = rgbToHSv({ red: colorRed, green: colorGreen, blue: colorBlue });
        var hue = ref.hue;
        var saturation = ref.saturation;
        var value = ref.value;

        setColorHue(hue);
        setColorSaturation(saturation);
        setColorValue(value);
    });

    var removePoint = React.useCallback(function (index) {
        if ( index === void 0 ) index = activePointIndex;

        if (gradientPoints.length <= 2) {
            return;
        }

        var localGradientPoints = gradientPoints.slice();
        localGradientPoints.splice(index, 1);

        setGradientPoints(localGradientPoints);

        if (index > 0) {
            setActivePointIndex(index - 1);
        }

        onChange && onChange({
            points: localGradientPoints,
            type: gradientType,
            degree: gradientDegree,
            style: generateGradientStyle(localGradientPoints, gradientType, gradientDegree),
        });
    }, [gradientPoints, activePointIndex, gradientType, gradientDegree, onChange]);

    var keyUpHandler = React.useCallback(function (event) {
        if ((event.keyCode === 46)) {
            removePoint(activePointIndex);
        }
    }, [activePointIndex, removePoint]);

    React.useEffect(function () {
        document.addEventListener('keyup', keyUpHandler);

        return function () {
            document.removeEventListener('keyup', keyUpHandler);
        };
    });

    var changeGradientControl = React.useCallback(function (ref, actionName) {
        var type = ref.type;
        var degree = ref.degree;
        if ( actionName === void 0 ) actionName = 'onChange';

        type = getRightValue(type, gradientType);
        degree = getRightValue(degree, gradientDegree);

        setGradientType(type);
        setGradientDegree(degree);

        var action = actions[actionName];

        action && action({
            points: gradientPoints,
            type: type,
            degree: degree,
            style: generateGradientStyle(gradientPoints, type, degree),
        });
    }, [actions, gradientPoints, gradientDegree, gradientType]);

    var changeActivePointIndex = React.useCallback(function (index) {
        setActivePointIndex(index);

        var localGradientPoint = gradientPoints[index];
        var red = localGradientPoint.red;
        var green = localGradientPoint.green;
        var blue = localGradientPoint.blue;
        var alpha = localGradientPoint.alpha;
        setActivePoint(localGradientPoint);

        setColorRed(red);
        setColorGreen(green);
        setColorBlue(blue);
        setColorAlpha(alpha);

        var ref = rgbToHSv({ red: red, green: green, blue: blue });
        var hue = ref.hue;
        var saturation = ref.saturation;
        var value = ref.value;

        setColorHue(hue);
        setColorSaturation(saturation);
        setColorValue(value);
    }, [gradientPoints]);

    var updateColor = React.useCallback(function (ref, actionName) {
        var red = ref.red;
        var green = ref.green;
        var blue = ref.blue;
        var alpha = ref.alpha;
        var hue = ref.hue;
        var saturation = ref.saturation;
        var value = ref.value;
        if ( actionName === void 0 ) actionName = 'onChange';

        red = getRightValue(red, colorRed);
        green = getRightValue(green, colorGreen);
        blue = getRightValue(blue, colorBlue);
        alpha = getRightValue(alpha, colorAlpha);
        hue = getRightValue(hue, colorHue);
        saturation = getRightValue(saturation, colorSaturation);
        value = getRightValue(value, colorValue);

        var localGradientPoints = gradientPoints.slice();

        localGradientPoints[activePointIndex] = Object.assign({}, localGradientPoints[activePointIndex],
            {red: red,
            green: green,
            blue: blue,
            alpha: alpha});

        setColorRed(red);
        setColorGreen(green);
        setColorBlue(blue);
        setColorAlpha(alpha);
        setColorHue(hue);
        setColorSaturation(saturation);
        setColorValue(value);
        setGradientPoints(localGradientPoints);

        var action = actions[actionName];

        action && action({
            points: localGradientPoints,
            type: gradientType,
            degree: gradientDegree,
            style: generateGradientStyle(localGradientPoints, gradientType, gradientDegree),
        });
    }, [
        colorRed, colorGreen, colorBlue, colorAlpha,
        colorHue, colorSaturation, colorValue,
        activePointIndex, gradientPoints, actions, gradientType, gradientDegree ]);

    var updateGradientLeft = React.useCallback(function (left, index, actionName) {
        if ( actionName === void 0 ) actionName = 'onChange';

        var localGradientPoints = gradientPoints.slice();
        localGradientPoints[index].left = left;

        setGradientPoints(localGradientPoints);

        var action = actions[actionName];

        action && action({
            points: localGradientPoints,
            type: gradientType,
            degree: gradientDegree,
            style: generateGradientStyle(localGradientPoints, gradientType, gradientDegree),
        });
    }, [actions, gradientPoints, gradientDegree, gradientType]);

    var addPoint = React.useCallback(function (left) {
        var localGradientPoints = gradientPoints.slice();

        localGradientPoints.push(Object.assign({}, localGradientPoints[activePointIndex],
            {left: left}));

        setGradientPoints(localGradientPoints);
        setActivePointIndex(localGradientPoints.length - 1);

        onChange && onChange({
            points: localGradientPoints,
            type: gradientType,
            degree: gradientDegree,
            style: generateGradientStyle(localGradientPoints, gradientType, gradientDegree),
        });
    }, [onChange, gradientPoints, activePointIndex, gradientType, gradientDegree]);

    return (
        React__default['default'].createElement( React__default['default'].Fragment, null, 
            React__default['default'].createElement( GradientControls, {
                type: gradientType, degree: gradientDegree, changeGradientControl: changeGradientControl }), 
            React__default['default'].createElement( Area, {
                red: colorRed, green: colorGreen, blue: colorBlue, alpha: colorAlpha, hue: colorHue, saturation: colorSaturation, value: colorValue, updateRgb: updateColor, isGradient: true, type: gradientType, degree: gradientDegree, points: gradientPoints, activePointIndex: activePointIndex, changeGradientControl: changeGradientControl, changeActivePointIndex: changeActivePointIndex, updateGradientLeft: updateGradientLeft, addPoint: addPoint, removePoint: removePoint }), 
            React__default['default'].createElement( Preview$1, {
                red: colorRed, green: colorGreen, blue: colorBlue, alpha: colorAlpha, updateRgb: updateColor })
        )
    );
}

function ColorPicker(ref) {
    var color = ref.color;
    var isGradient = ref.isGradient;
    var gradient = ref.gradient;
    var onStartChange = ref.onStartChange;
    var onChange = ref.onChange;
    var onEndChange = ref.onEndChange;

    return (
        React__default['default'].createElement( 'div', { className: "ui-color-picker" }, 
            isGradient
                    ? (
                        React__default['default'].createElement( Gradient, {
                            points: gradient.points, updateColor: onChange, type: gradient.type, degree: gradient.degree, onChange: onChange, onStartChange: onStartChange, onEndChange: onEndChange })
                    )
                    : (
                        React__default['default'].createElement( Solid, {
                            red: color.red, green: color.green, blue: color.blue, alpha: color.alpha, onChange: onChange, onStartChange: onStartChange, onEndChange: onEndChange })
                    )
        )
    );
}

ColorPicker.defaultProps = {
    isGradient: false,
    onChange: function () {},
    color: {
        red: 255,
        green: 0,
        blue: 0,
        alpha: 1,
    },
    gradient: {
        points: [
            {
                left: 0,
                red: 0,
                green: 0,
                blue: 0,
                alpha: 1,
            },
            {
                left: 100,
                red: 255,
                green: 0,
                blue: 0,
                alpha: 1,
            } ],
        degree: 0,
        type: 'linear',
    },
};

exports.ColorPicker = ColorPicker;
//# sourceMappingURL=index-cjs.js.map
