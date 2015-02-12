   var _o_ = _o_ || {};
    _.extend(_o_, {
        typeis : function(arg1, arg2) {
                arg2 = arg2 ? arg2 : ""
                typeis = Object.prototype.toString.call(arg1)
                console.log( arg2 +' typeis: ', typeis);     
                }
    });
    //_o_.typeis( new Date() );