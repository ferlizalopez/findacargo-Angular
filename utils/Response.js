/**
 * Created by jeton on 6/20/2017.
 */
module.exports = {
    success: function(res, msg = null, data = null){
        res.status(200);
        res.send({
            success: true,
            body: data,
            msg: msg
        });
    },
    noData: function(res, msg = null, data = null){
        res.status(200);
        res.send({
            success: false,
            body: data,
            msg: msg
        });
    },
    error: function(res, error){
        res.status(400)
    },
    badRequest: function(res, msg = null, data = null){
        res.status(400);
        res.send({
            success: false,
            msg: msg,
            body: data
        });
    },
    unAuthorized: function(res, msg = null, data = null){
        res.status(401);
        res.send({
            success: false,
            msg: msg,
            body: data
        });
    },
    dbError: function(res, data, msg){
        res.status(500).send({
            success: false,
            body: data,
            body: msg
        });
    },
    showErrors: function (err) {
        var tmpErrors = [];
        if(err.errors){
            if(err.errors.length){
                err.errors.forEach(error => {
                    tmpErrors.push(error.message)
                });
            }
        }else{
            tmpErrors.push(err.message);
        }
        return tmpErrors.join(', ');
    }
};