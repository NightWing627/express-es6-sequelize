"use strict";

// Component Definition
var Wizard = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = Util.getById(elementId);
    var body = Util.getBody();

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        startStep: 1,
        clickableSteps: false // to make steps clickable this set value true and add data-wizard-clickable="true" in HTML for class="wizard" element
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            if (Util.data(element).has('wizard')) {
                the = Util.data(element).get('wizard');
            } else {
                // reset menu
                Plugin.init(options);

                // build menu
                Plugin.build();

                Util.data(element).set('wizard', the);
            }

            return the;
        },

        /**
         * Init wizard
         */
        init: function(options) {
            the.element = element;
            the.events = [];

            // merge default and user defined options
            the.options = Util.deepExtend({}, defaultOptions, options);

            // Elements
            the.steps = Util.findAll(element, '[data-wizard-type="step"]');

            the.btnSubmit = Util.find(element, '[data-wizard-type="action-submit"]');
            the.btnNext = Util.find(element, '[data-wizard-type="action-next"]');
            the.btnPrev = Util.find(element, '[data-wizard-type="action-prev"]');
            the.btnLast = Util.find(element, '[data-wizard-type="action-last"]');
            the.btnFirst = Util.find(element, '[data-wizard-type="action-first"]');

            // Variables
            the.events = [];
            the.currentStep = 1;
            the.stopped = false;
            the.totalSteps = the.steps.length;

            // Init current step
            if (the.options.startStep > 1) {
                Plugin.goTo(the.options.startStep);
            }

            // Init UI
            Plugin.updateUI();
        },

        /**
         * Build Form Wizard
         */
        build: function() {
            // Next button event handler
            Util.addEvent(the.btnNext, 'click', function(e) {
                e.preventDefault();
                Plugin.goTo(Plugin.getNextStep(), true);
            });

            // Prev button event handler
            Util.addEvent(the.btnPrev, 'click', function(e) {
                e.preventDefault();
                Plugin.goTo(Plugin.getPrevStep(), true);
            });

            // First button event handler
            Util.addEvent(the.btnFirst, 'click', function(e) {
                e.preventDefault();
                Plugin.goTo(Plugin.getFirstStep(), true);
            });

            // Last button event handler
            Util.addEvent(the.btnLast, 'click', function(e) {
                e.preventDefault();
                Plugin.goTo(Plugin.getLastStep(), true);
            });

            // Last button event handler
            Util.addEvent(the.btnSubmit, 'click', function(e) {
                e.preventDefault();
                Plugin.eventTrigger('beforeSubmit');
            });

            if (the.options.clickableSteps === true) {
                Util.on(element, '[data-wizard-type="step"]', 'click', function() {
                    var index = Util.index(this) + 1;
                    if (index !== the.currentStep) {
                        Plugin.goTo(index, true);
                    }
                });
            }
        },

        /**
         * Handles wizard click wizard
         */
        goTo: function(number, eventHandle) {
            // Skip if this step is already shown
            if (number === the.currentStep || number > the.totalSteps || number < 0) {
                return;
            }

            // Validate step number
            if (number) {
                number = parseInt(number);
            } else {
                number = Plugin.getNextStep();
            }

            // Before next and prev events
            var callback;

            if (eventHandle === true) {
                if (number > the.currentStep) {
                    callback = Plugin.eventTrigger('beforeNext');
                } else {
                    callback = Plugin.eventTrigger('beforePrev');
                }
            }

            // Skip if stopped
            if (the.stopped === true) {
                the.stopped = false;
                return;
            }

            // Continue if no exit
            if (callback !== false) {
                // Before change
                if (eventHandle === true) {
                    Plugin.eventTrigger('beforeChange');
                }

                // Set current step
                the.currentStep = number;

                Plugin.updateUI();

                // Trigger change event
                if (eventHandle === true) {
                    Plugin.eventTrigger('change');
                }
            }

            // After next and prev events
            if (eventHandle === true) {
                if (number > the.startStep) {
                    Plugin.eventTrigger('afterNext');
                } else {
                    Plugin.eventTrigger('afterPrev');
                }
            }

            return the;
        },

        /**
         * Cancel
         */
        stop: function() {
            the.stopped = true;
        },

        /**
         * Resume
         */
        start: function() {
            the.stopped = false;
        },

        /**
         * Check last step
         */
        isLastStep: function() {
            return the.currentStep === the.totalSteps;
        },

        /**
         * Check first step
         */
        isFirstStep: function() {
            return the.currentStep === 1;
        },

        /**
         * Check between step
         */
        isBetweenStep: function() {
            return Plugin.isLastStep() === false && Plugin.isFirstStep() === false;
        },

        /**
         * Go to the first step
         */
        updateUI: function() {
            var stepType = '';
            var index = the.currentStep - 1;

            if (Plugin.isLastStep()) {
                stepType = 'last';
            } else if (Plugin.isFirstStep()) {
                stepType = 'first';
            } else {
                stepType = 'between';
            }

            Util.attr(the.element, 'data-wizard-state', stepType);

            // Steps
            var steps = Util.findAll(the.element, '[data-wizard-type="step"]');

            if (steps && steps.length > 0) {
                for (var i = 0, len = steps.length; i < len; i++) {
                    if (i == index) {
                        Util.attr(steps[i], 'data-wizard-state', 'current');
                    } else {
                        if (i < index) {
                            Util.attr(steps[i], 'data-wizard-state', 'done');
                        } else {
                            Util.attr(steps[i], 'data-wizard-state', 'pending');
                        }
                    }
                }
            }

            // Steps Info
            var stepsInfo = Util.findAll(the.element, '[data-wizard-type="step-info"]');
            if (stepsInfo &&stepsInfo.length > 0) {
                for (var i = 0, len = stepsInfo.length; i < len; i++) {
                    if (i == index) {
                        Util.attr(stepsInfo[i], 'data-wizard-state', 'current');
                    } else {
                        Util.removeAttr(stepsInfo[i], 'data-wizard-state');
                    }
                }
            }

            // Steps Content
            var stepsContent = Util.findAll(the.element, '[data-wizard-type="step-content"]');
            if (stepsContent&& stepsContent.length > 0) {
                for (var i = 0, len = stepsContent.length; i < len; i++) {
                    if (i == index) {
                        Util.attr(stepsContent[i], 'data-wizard-state', 'current');
                    } else {
                        Util.removeAttr(stepsContent[i], 'data-wizard-state');
                    }
                }
            }
        },

        /**
         * Get next step
         */
        getNextStep: function() {
            if (the.totalSteps >= (the.currentStep + 1)) {
                return the.currentStep + 1;
            } else {
                return the.totalSteps;
            }
        },

        /**
         * Get prev step
         */
        getPrevStep: function() {
            if ((the.currentStep - 1) >= 1) {
                return the.currentStep - 1;
            } else {
                return 1;
            }
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name, nested) {
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the);
                        }
                    } else {
                        return event.handler.call(this, the);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });

            return the;
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Go to the next step
     */
    the.goNext = function(eventHandle) {
        return Plugin.goTo(Plugin.getNextStep(), eventHandle);
    };

    /**
     * Go to the prev step
     */
    the.goPrev = function(eventHandle) {
        return Plugin.goTo(Plugin.getPrevStep(),eventHandle);
    };

    /**
     * Go to the last step
     */
    the.goLast = function(eventHandle) {
        return Plugin.goTo(Plugin.getLastStep(), eventHandle);
    };

    /**
     * Go to the first step
     */
    the.goFirst = function(eventHandle) {
        return Plugin.goTo(Plugin.getFirstStep(), eventHandle);
    };

    /**
     * Go to a step
     */
    the.goTo = function(number, eventHandle) {
        return Plugin.goTo(number, eventHandle);
    };

    /**
     * Cancel step
     */
    the.stop = function() {
        return Plugin.stop();
    };

    /**
     * Resume step
     */
    the.start = function() {
        return Plugin.start();
    };

    /**
     * Get current step number
     */
    the.getStep = function() {
        return the.currentStep;
    };

    /**
     * Check last step
     */
    the.isLastStep = function() {
        return Plugin.isLastStep();
    };

    /**
     * Check first step
     */
    the.isFirstStep = function() {
        return Plugin.isFirstStep();
    };

    /**
     * Attach event
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    // Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Wizard;
}

window.UtilElementDataStore = {};
window.UtilElementDataStoreID = 0;
window.UtilDelegatedEventHandlers = {};

var Util = function() {
    return {
        data: function(el) {
            return {
                set: function(name, data) {
                    if (!el) {
                        return;
                    }
        
                    if (el.customDataTag === undefined) {
                        window.UtilElementDataStoreID++;
                        el.customDataTag = window.UtilElementDataStoreID;
                    }
        
                    if (window.UtilElementDataStore[el.customDataTag] === undefined) {
                        window.UtilElementDataStore[el.customDataTag] = {};
                    }
        
                    window.UtilElementDataStore[el.customDataTag][name] = data;
                },
        
                get: function(name) {
                    if (!el) {
                        return;
                    }
        
                    if (el.customDataTag === undefined) {
                        return null;
                    }
        
                    return this.has(name) ? window.UtilElementDataStore[el.customDataTag][name] : null;
                },
        
                has: function(name) {
                    if (!el) {
                        return false;
                    }
        
                    if (el.customDataTag === undefined) {
                        return false;
                    }
        
                    return (window.UtilElementDataStore[el.customDataTag] && window.UtilElementDataStore[el.customDataTag][name]) ? true : false;
                },
        
                remove: function(name) {
                    if (el && this.has(name)) {
                        delete window.UtilElementDataStore[el.customDataTag][name];
                    }
                }
            };
        },
        // Deep extend:  $.extend(true, {}, objA, objB);
        deepExtend: function(out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i];

                if (!obj)
                    continue;

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object')
                            out[key] = Util.deepExtend(out[key], obj[key]);
                        else
                            out[key] = obj[key];
                    }
                }
            }

            return out;
        },
        find: function(parent, query) {
            parent = Util.getById(parent);
            if (parent) {
                return parent.querySelector(query);
            }
        },

        findAll: function(parent, query) {
            parent = Util.getById(parent);
            if (parent) {
                return parent.querySelectorAll(query);
            }
        },
        addEvent: function(el, type, handler, one) {
            if (typeof el !== 'undefined' && el !== null) {
                el.addEventListener(type, handler);
            }
        },
        on: function(element, selector, event, handler) {
            if (!selector) {
                return;
            }

            var eventId = Util.getUniqueID('event');

            window.UtilDelegatedEventHandlers[eventId] = function(e) {
                var targets = element.querySelectorAll(selector);
                var target = e.target;

                while (target && target !== element) {
                    for (var i = 0, j = targets.length; i < j; i++) {
                        if (target === targets[i]) {
                            handler.call(target, e);
                        }
                    }

                    target = target.parentNode;
                }
            }

            Util.addEvent(element, event, window.UtilDelegatedEventHandlers[eventId]);

            return eventId;
        },

        off: function(element, event, eventId) {
            if (!element || !window.UtilDelegatedEventHandlers[eventId]) {
                return;
            }

            Util.removeEvent(element, event, window.UtilDelegatedEventHandlers[eventId]);

            delete window.UtilDelegatedEventHandlers[eventId];
        },
        getById: function(el) {
            if (typeof el === 'string') {
                return document.getElementById(el);
            } else {
                return el;
            }
        },

        getByTag: function(query) {
            return document.getElementsByTagName(query);
        },

        getByTagName: function(query) {
            return document.getElementsByTagName(query);
        },

        getByClass: function(query) {
            return document.getElementsByClassName(query);
        },

        getBody: function() {
            return document.getElementsByTagName('body')[0];
        },
        index: function( el ){
            var c = el.parentNode.children, i = 0;
            for(; i < c.length; i++ )
                if( c[i] == el ) return i;
        },

        trim: function(string) {
            return string.trim();
        },
        attr: function(el, name, value) {
            if (el == undefined) {
                return;
            }

            if (value !== undefined) {
                el.setAttribute(name, value);
            } else {
                return el.getAttribute(name);
            }
        },
        removeAttr: function(el, name) {
            if (el == undefined) {
                return;
            }

            el.removeAttribute(name);
        },
        scrollTop: function(offset, duration) {
            Util.scrollTo(null, offset, duration);
        },
        scrollTo: function(target, offset, duration) {
            var duration = duration ? duration : 500;
            var targetPos = target ? KTUtil.offset(target).top : 0;
            var scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            var from, to;

            if (offset) {
                scrollPos += offset;
            }

            from = scrollPos;
            to = targetPos;

            Util.animate(from, to, duration, function(value) {
                document.documentElement.scrollTop = value;
                document.body.parentNode.scrollTop = value;
                document.body.scrollTop = value;
            }); //, easing, done
        },
        animate: function(from, to, duration, update, easing, done) {
            /**
             * TinyAnimate.easings
             *  Adapted from jQuery Easing
             */
            var easings = {};
            var easing;

            easings.linear = function(t, b, c, d) {
                return c * t / d + b;
            };

            easing = easings.linear;

            // Early bail out if called incorrectly
            if (typeof from !== 'number' ||
                typeof to !== 'number' ||
                typeof duration !== 'number' ||
                typeof update !== 'function') {
                return;
            }

            // Create mock done() function if necessary
            if (typeof done !== 'function') {
                done = function() {};
            }

            // Pick implementation (requestAnimationFrame | setTimeout)
            var rAF = window.requestAnimationFrame || function(callback) {
                window.setTimeout(callback, 1000 / 50);
            };

            // Animation loop
            var canceled = false;
            var change = to - from;

            function loop(timestamp) {
                var time = (timestamp || +new Date()) - start;

                if (time >= 0) {
                    update(easing(time, from, change, duration));
                }
                if (time >= 0 && time >= duration) {
                    update(to);
                    done();
                } else {
                    rAF(loop);
                }
            }

            update(from);

            // Start animation loop
            var start = window.performance && window.performance.now ? window.performance.now() : +new Date();

            rAF(loop);
        },
    }
}();

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Util;
}
