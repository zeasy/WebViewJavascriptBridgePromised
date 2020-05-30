
var bridgeName = window.WebViewJavascriptBridgeName || "WebViewJavascriptBridge";
var callbacksName = window.WebViewJavascriptCallbacksName || "WVJBCallbacks";
var protocolScheme = window.WebViewJavascriptProtocolScheme || "https";
var setupEvent = protocolScheme + '://__bridge_setup__';

function setupWebViewJavascriptBridge(callback) {
	if (window[bridgeName]) { return callback(window[bridgeName]); }
	if (window[callbacksName]) { return window[callbacksName].push(callback); }
	window[callbacksName] = [callback];
	var WVJBIframe = document.createElement('iframe');
	WVJBIframe.style.display = 'none';
	WVJBIframe.src = protocolScheme + '://__bridge_loaded__';
	document.documentElement.appendChild(WVJBIframe);
	setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

setupWebViewJavascriptBridge(function(bridge) {
    window.dispatchEvent(new Event(setupEvent))
})

const promised = function() {
    return new Promise(function(resolve) {
        if(window[bridgeName]) {
            resolve(window[bridgeName])
        } else {
            var listener = function() {
                window.removeEventListener(setupEvent, listener)
                resolve(window[bridgeName])
            };
            window.addEventListener(setupEvent,listener)
        }
    })
}

const callHandler = function(handlerName, options, responseCallback) {
    return promised().then(function(bridge) {
        bridge.callHandler(handlerName, options, responseCallback)
    })
}

const registerHandler = function(handlerName, callback) {
    return promised().then(function(bridge) {
        bridge.registerHandler(handlerName, callback)
    })
}

module.exports = {
    callHandler : callHandler,
    registerHandler : registerHandler,
    promised : promised,
}
