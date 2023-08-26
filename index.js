window.launcher.addModule("utils",
    () => { //activate

        // Initialize the utils module within the launcher's namespace
        window[launcher.config.name].utils = {};

        /**
         * Patch a function with a hook function.
         * @param {object} obj - The object containing the target function.
         * @param {string} targetFunction - The name of the target function to be patched.
         * @param {function} hookFunction - The hook function to be applied.
         */
        window[launcher.config.name].utils.patchFunction = (obj, targetFunction, hookFunction) => {
            let temp = obj[targetFunction];
            obj[targetFunction] = function (...args) {
                let ret = temp.apply(this, args);
                if (ret && typeof ret.then === 'function') {
                    return ret.then((value) => {
                        hookFunction([value, args]);
                        return value;
                    });
                } else {
                    hookFunction([ret, args]);
                    return ret;
                }
            };
        };

        /**
         * Unfreezes a frozen object using structured cloning.
         * @param {object} obj - The frozen object to be unfrozen.
         */
        window[launcher.config.name].utils.unfreezeObj = (obj) => {
            // Use structured cloning to create an unfrozen copy of the object
            obj = structuredClone(obj);
        };

        /**
        * Utility function to decode and log the content of a JSON Web Token (JWT).
        * @param {string} token - The JSON Web Token to be decoded.
        */
        window[launcher.config.name].utils.decodeJWT = (token) => {
            // Split the token into its components and decode the payload
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
  
            // Log the decoded token content
            console.log("Decoded JWT:", decodedToken);
        },

        /**
        * Overrides the XMLHttpRequest's setRequestHeader method to intercept and log Authorization headers.
        * Once an Authorization header is intercepted, the override is removed to restore normal behavior.
        */
        window[launcher.config.name].utils.interceptAuthorizationHeader = () => {
            // Store the original setRequestHeader method
            const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
          
            // Override the setRequestHeader method
            XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
              // Call the original method
              originalSetRequestHeader.call(this, header, value);
          
              // Check if the header is 'Authorization'
              if (header === 'Authorization') {
                window[launcher.config.name].logger.log('Here is your auth code:', value);
          
                // Remove the override to prevent further logging
                XMLHttpRequest.prototype.setRequestHeader = originalSetRequestHeader;
              }
            };
        },

        /**
        * Overrides the XMLHttpRequest's setRequestHeader method to intercept and log specified headers.
        * Once a specified header is intercepted, the override is removed to restore normal behavior.
        * @param {string} headerToIntercept - The name of the header to intercept and log.
        */
        window[launcher.config.name].utils.interceptHeader = (headerToIntercept) => {
            // Store the original setRequestHeader method
            const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
        
            // Override the setRequestHeader method
            XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            // Call the original method
            originalSetRequestHeader.call(this, header, value);
        
            // Check if the header matches the header to intercept
            if (header === headerToIntercept) {
                window[launcher.config.name].logger.log(`Intercepted ${headerToIntercept} header:`, value);
        
                // Remove the override to prevent further logging
                XMLHttpRequest.prototype.setRequestHeader = originalSetRequestHeader;
            }
            };
        },
        
        /**
         * Retrieves the nonce value from the Content Security Policy (CSP) header.
         * @returns {string|null} The nonce value from the CSP header, or null if not found.
         */
        window[launcher.config.name].utils.getNonceFromCSP = () => {
            // Retrieve the content of the CSP header
            const cspHeader = document.querySelector("meta[http-equiv='Content-Security-Policy']");
        
            // Check if CSP header is present
            if (cspHeader) {
            // Extract the nonce value from the CSP header using regular expression
            const match = cspHeader.getAttribute("content").match(/nonce-([a-zA-Z0-9+\/=]+)/);
        
            // If a match is found, return the nonce value
            if (match && match[1]) {
                return match[1];
            }
            }
        
            // If CSP header or nonce is not found, return null
            return null;
        },
        // Cookie Utils
        window[launcher.config.name].utils.cookies = {

            /**
             * A utility function to set a cookie in the browser.
             * @param {string} name - The name of the cookie.
             * @param {string} value - The value to be stored in the cookie.
             * @param {number} days - The number of days the cookie should be valid for.
             */
            setCookie : (name, value, days) => {
                let expires = "";
                if (days) {
                    let date = new Date();
                    // Calculate the expiration date by adding the specified number of days
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    expires = "; expires=" + date.toUTCString();
                }
                
                // Set the cookie with the provided name, value, and expiration
                document.cookie = name + "=" + (value || "") + expires + "; path=/";
            },

            /**
             * A utility function to retrieve the value of a cookie by its name.
             * @param {string} name - The name of the cookie to retrieve.
             * @returns {string|null} The value of the cookie, or null if the cookie is not found.
             */
            getCookie : (name) => {
                let nameEQ = name + "=";
                let ca = document.cookie.split(';');
                for (let i = 0; i < ca.length; i++) {
                    let c = ca[i];

                    // Remove leading spaces from the cookie string
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1, c.length);
                    }

                    // If the cookie's name matches, return its value
                    if (c.indexOf(nameEQ) == 0) {
                        return c.substring(nameEQ.length, c.length);
                    }
                }

                // Return null if the cookie is not found
                return null;
            },

            /**
             * A utility function to erase a cookie by setting its expiration to the past.
             * @param {string} name - The name of the cookie to erase.
             */
            eraseCookie : (name) => {
                // Set the cookie's expiration to a past time to remove it
                document.cookie = name + '=; Max-Age=-99999999;';
            }
        },
        // URL Utils
        window[launcher.config.name].utils.url = {   

            /**
             * A utility function to retrieve the value of a query parameter from the current URL.
             * @param {string} variable - The name of the query parameter to retrieve.
             * @returns {string|false} The value of the query parameter, or false if it's not found.
             */
            getQueryVariable : (variable) => {
                let query = window.location.search.substring(1);
                let vars = query.split("&");
                for (let i = 0; i < vars.length; i++) {
                    let pair = vars[i].split("=");
                    if (pair[0] == variable) {
                        return pair[1];
                    }
                }

                // Return false if the query parameter is not found
                return false;
            },

            /**
             * A utility function to retrieve the value of a query parameter from a given URL.
             * @param {string} url - The URL containing the query parameter.
             * @param {string} variable - The name of the query parameter to retrieve.
             * @returns {string|false} The value of the query parameter, or false if it's not found.
             */
            getQueryVariableFromUrl : (url, variable) => {
                let query = url.split('?')[1];
                let vars = query.split("&");
                for (let i = 0; i < vars.length; i++) {
                    let pair = vars[i].split("=");
                    if (pair[0] == variable) {
                        return pair[1];
                    }
                }

                // Return false if the query parameter is not found
                return false;
            },

            /**
             * A utility function to parse and retrieve query parameters from a URL.
             * @param {string} url - The URL containing the query parameters.
             * @returns {Object} An object containing key-value pairs of query parameters.
             */
            getQueryParams : (url) => {
                // Split the URL to isolate the query string
                let query = url.split('?')[1];
                let vars = query.split("&");
                
                // Initialize an object to store the query parameters
                let params = {};
                
                // Iterate through each parameter pair and store them in the object
                for (let i = 0; i < vars.length; i++) {
                    let pair = vars[i].split("=");
                    params[pair[0]] = pair[1];
                }

                // Return the object containing the parsed query parameters
                return params;
            }
        },
        // localStorage Utils
        window[launcher.config.name].utils.localStorage = {

            /**
             * Set a key-value pair in localStorage.
             * @param {string} key - The key to associate with the value.
             * @param {any} value - The value to store in localStorage.
             */
            setItem: function(key, value) {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    window[launcher.config.name].logger.log(`localStorage: Set ${key} = ${JSON.stringify(value)}`);
                } catch (error) {
                    window[launcher.config.name].logger.log(`localStorage: Error setting ${key}: ${error}`);
                }
            },

            /**
             * Get the value associated with a key from localStorage.
             * @param {string} key - The key to retrieve the value for.
             * @returns {any|null} The retrieved value, or null if not found.
             */
            getItem: function(key) {
                try {
                    const value = JSON.parse(localStorage.getItem(key));
                    window[launcher.config.name].logger.log(`localStorage: Get ${key} = ${JSON.stringify(value)}`);
                    return value;
                } catch (error) {
                    window[launcher.config.name].logger.log(`localStorage: Error getting ${key}: ${error}`);
                    return null;
                }
            },

            /**
             * Remove a key-value pair from localStorage.
             * @param {string} key - The key to remove.
             */
            removeItem: function(key) {
                try {
                    localStorage.removeItem(key);
                    window[launcher.config.name].logger.log(`localStorage: Removed ${key}`);
                } catch (error) {
                    window[launcher.config.name].logger.log(`localStorage: Error removing ${key}: ${error}`);
                }
            },

            /**
             * Clear all data from localStorage.
             */
            clear: function() {
                try {
                    localStorage.clear();
                    window[launcher.config.name].logger.log('localStorage: Cleared all data');
                } catch (error) {
                    window[launcher.config.name].logger.log(`localStorage: Error clearing data: ${error}`);
                }
            }
        },
        // sessionStorage Utils
        window[launcher.config.name].utils.sessionStorage = {
            
            /**
             * Set a key-value pair in sessionStorage.
             * @param {string} key - The key to associate with the value.
             * @param {any} value - The value to store in sessionStorage.
             */
            setItem: function(key, value) {
                try {
                    sessionStorage.setItem(key, JSON.stringify(value));
                    window[launcher.config.name].logger.log(`sessionStorage: Set ${key} = ${JSON.stringify(value)}`);
                } catch (error) {
                    window[launcher.config.name].logger.log(`sessionStorage: Error setting ${key}: ${error}`);
                }
            },

            /**
             * Get the value associated with a key from sessionStorage.
             * @param {string} key - The key to retrieve the value for.
             * @returns {any|null} The retrieved value, or null if not found.
             */
            getItem: function(key) {
                try {
                    const value = JSON.parse(sessionStorage.getItem(key));
                    window[launcher.config.name].logger.log(`sessionStorage: Get ${key} = ${JSON.stringify(value)}`);
                    return value;
                } catch (error) {
                    window[launcher.config.name].logger.log(`sessionStorage: Error getting ${key}: ${error}`);
                    return null;
                }
            },

            /**
             * Remove a key-value pair from sessionStorage.
             * @param {string} key - The key to remove.
             */
            removeItem: function(key) {
                try {
                    sessionStorage.removeItem(key);
                    window[launcher.config.name].logger.log(`sessionStorage: Removed ${key}`);
                } catch (error) {
                    window[launcher.config.name].logger.log(`sessionStorage: Error removing ${key}: ${error}`);
                }
            },

            /**
             * Clear all data from sessionStorage.
             */
            clear: function() {
                try {
                    sessionStorage.clear();
                    window[launcher.config.name].logger.log('sessionStorage: Cleared all data');
                } catch (error) {
                    window[launcher.config.name].logger.log(`sessionStorage: Error clearing data: ${error}`);
                }
            }
        };
        
    },
    () => { //deactivate
        // When the module is deactivated, remove the utils module from the launcher's namespace
        delete window[launcher.config.name].utils;
    }
);
