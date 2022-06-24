/////// JQUERY CUSTOM PLUGINS : ST
// CUSTOM VALIDATOR
(function($) {
    // default variables val 
    var defaults = {
        displayErrMsg : true,
        group: ".form-group",
        errContainer: ".txt-err",
        color: "orange",
        rules: {},
        messages: {
            default: {
                required: "This field is required.",
                min: "The input value must be greater than the designated value.",
                regex: "The input value is not following the accepted pattern format.",
                filePdf: "The file must be in pdf format."
            }
        },
    };

    // contains processes for each rules 
    var methods = {
        required: isRequiredPassed,
        min: isMinPassed,
        regex: isRegexPassed,
        filePdf: isPdfExtensionPassed,
    };

    // plugin definition 
    // note: 
    // - this: input html element
    $.fn.findError = function(options) {
        // merge options given by user & default value
        var settings = $.extend(true, {}, defaults, options);
        var errLength = 0;

        var objFiltered = this.filter(function(idx, obj) {
            return obj.name in settings.rules
        })
        var typeObj = typeof objFiltered;

        // loop each object 
        // goal: check keys in rules -> check condition in rules
        // goal: display msgs
        for (var i = 0; i < objFiltered.length; i++) {
            var jqObjFiltered = $(objFiltered[i]);
            var jqObjFilteredName = jqObjFiltered.attr('name');

            console.log({
                jqObjFiltered,
                jqObjFilteredName
            });

            // loop keys in the rules[x][ruleKey]
            var inputRule = settings.rules[jqObjFilteredName];
            for (var ruleKey in inputRule) {
                var ruleVal = inputRule[ruleKey];
                console.log(`- ${ruleKey}`);
                // check for rules methods 
                var isPassed = methods[ruleKey].apply(jqObjFiltered, [ruleVal]);

                // if has error 
                // > increase errLength
                // > display err message
                // > check another input 
                // else 
                // > check other rules key of the same input till end 
                if (!isPassed) {
                    errLength++;

                    var msg =
                        settings.messages[jqObjFilteredName] && settings.messages[jqObjFilteredName][
                            ruleKey
                        ] ?
                        settings.messages[jqObjFilteredName][ruleKey] :
                        settings.messages['default'][ruleKey];
                    // var msg = settings.messages[jqObjFilteredName][ruleKey] ??
                    //     settings.messages['default'][ruleKey];
                    if (settings.displayErrMsg) displayMsg(jqObjFiltered, msg);
                    break;
                } else {
                    if (settings.displayErrMsg) displayMsg(jqObjFiltered, '');
                }
            }
        }

        console.log('new custom err udated');
        return errLength;
        // return this; 
    }

    // if input has 'empty string' or 'only spaces' > false 
    // else > true
    // note:
    // - this : input element
    function isRequiredPassed(val) {  
        if(val){
            return $(this).val().trim() ? $(this).val().trim() : false;
        }
        return true;
    }

    // if input matches regex pattern > true
    // note:
    // - this : input element
    // - val  : regex pattern 
    function isRegexPassed(val) {
        var inpVal = $(this).val().trim();
        const regex = new RegExp(val);
        const isMatched = regex.test(inpVal);

        console.log({
            inpVal,
            isMatched
        });

        return isMatched;
    }

    // if input lower val than min > false 
    // else > true
    // note:
    // - this : input element
    function isMinPassed(lowerLim) {
        var valNum = Number($(this).val());
        return valNum > lowerLim;
    }

    // only check for pdf ext
    // note:
    // - this : input element
    function isPdfExtensionPassed() {
        var txt = $(this).val().trim();
        console.log('txt', txt);
        var allowedExtensions = /(\.pdf)$/i;
        return txt == '' || (allowedExtensions.exec(txt) && allowedExtensions.exec(txt)[0]) ? true : false;
    }

    // search: input's parent container
    // search: err message span
    // display: err message
    function displayMsg(selectedElem, msg) {
        var parentContainer = $(selectedElem).closest(defaults.group);
        var errContainer = parentContainer.find(defaults.errContainer);
        errContainer.text(msg);
    }

}(jQuery));
/////// JQUERY CUSTOM PLUGINS : En