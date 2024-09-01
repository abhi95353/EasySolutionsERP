function ScriptLoad() {
    var config = {
        "root": "",
        "flow": "DEFAULT",
        "data": {
            "orderId": "fwef23rf2wdfw32", /* update order id */
            "token": "qged723tddgydg", /* update token value */
            "tokenType": "TXN_TOKEN",
            "amount": "100" /* update amount */
        },
        "handler": {
            "notifyMerchant": function (eventName, data) {
                console.log("notifyMerchant handler function called");
                console.log("eventName => ", eventName);
                console.log("data => ", data);
            }
        }
    };

    if (window.Paytm && window.Paytm.CheckoutJS) {
        window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
            // after successfully updating configuration, invoke JS Checkout
            console.log('ok2')
            window.Paytm.CheckoutJS.invoke();
        }).catch(function onError(error) {
            console.log("error => ", error);
        });
    }
}