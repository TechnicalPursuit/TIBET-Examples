//  ========================================================================
/**
 * @type APP.pizza.ordersummary
 * @summary A computed tag (meaning its UI is generated via a method) which
 *     handles display of instructions and responses from the server.
 *
 *     This tag displays instructions when the application hasn't got an active
 *     order in progress. When an order has been submitted the content shifts to
 *     display order time and state. When an order is pending it can be
 *     cancelled by using the Cancel Order button which is enabled based on that
 *     specific order state (otherwise it's disabled).
 */
//  ------------------------------------------------------------------------

TP.tag.ComputedTag.defineSubtype('APP.pizza:orderstatus');

APP.pizza.orderstatus.defineAttribute('themeURI', TP.NO_RESULT);

//  ------------------------------------------------------------------------
//  Type Methods
//  ------------------------------------------------------------------------

APP.pizza.orderstatus.Type.defineMethod('tagCompile',
function(aRequest) {

    /**
     * @method tagCompile
     * @summary Produces content used to potentially replace the instance's
     *     current DOM element. Using a computed tag lets us produce this
     *     replacement content from within JavaScript rather than via an XHTML
     *     file in the fashion of a templated tag.
     * @param {TP.sig.Request} aRequest The compilation request object.
     * @returns {?TP.dom.Element} The element to use as the receiver's content.
     */

    let elem,
        app,
        urn,
        order,
        content,
        disabled,
        body;

    if (!TP.isElement(elem = aRequest.at('node'))) {
        return;
    }

    //  Get the order data from the shared application location. We capture the
    //  URN here so we can inject its location in our template below.
    app = TP.sys.getApplication();
    urn = app.get('orderURN');
    order = urn.getValue();

    //  Prepare "body" content for the tag's main content region. Note that this
    //  content will itself be injected into a template further below. NOTE the
    //  use of TIBET's string formatting to produce a pretty-printed Date value.
    if (TP.isValid(order) && TP.notEmpty(order.received)) {
        disabled = order.status === 'pending' ? '' : 'disabled="disabled"';

        body = `
<div class="field">
    <label for="received">Received:</label>
    <span name="received">${new Date(order.received).as('%{mm}-%{dd}-%{yyyy} %{hhi}:%{mmn}:%{ss}')}</span>
</div>
<div class="field">
    <label for="status">Status:</label>
    <span name="status">${order.status}</span>
</div>
`;

    } else {
        disabled = 'disabled="disabled"';

        body = `
<span class="instructions">
Enter a name and phone number for your order as well as at least one pizza or side/extra. Thanks!
</span>`;
    }

    //  Produce the final content by injecting the just-prepared body content.
    //  NOTE that we use the urn.getLocation() value to avoid hard-coding the
    //  reference to the source data location here.
    content = `
<header>
    <h1>Order Status</h1>
</header>
<div class="body" bind:scope="${urn.getLocation()}#tibet()">
    <div class="status">
        ${body}
    </div>
</div>
<footer>
    <button name="cancel" on:click="CancelOrder" ${disabled}>Cancel Order</button>
</footer>
`;

    //  Set the updated content, ensuring our new content is considered XHTML.
    TP.nodeSetContent(elem, TP.xhtmlnode(content));

    return elem;
});

//  ------------------------------------------------------------------------
//  Inst Methods
//  ------------------------------------------------------------------------

APP.pizza.orderstatus.Inst.defineMethod('init',
function() {

    /**
     * @method init
     * @summary Initialize new instances. In this application there should only
     *     be a single instance and we set it up to observe OrderChange so we
     *     can re-render the tag content in response to state changes.
     * @listens {OrderChange}
     * @returns {APP.pizza.orderstatus} The new instance.
     */

    this.callNextMethod();

    this.observe(TP.sys.getApplication(), 'OrderChange');

    return this;
});

//  ------------------------------------------------------------------------

APP.pizza.orderstatus.Inst.defineMethod('isOrderCancellable',
function(anOrder) {

    /**
     * @method isOrderCancellable
     * @summary Returns true if the order is in a state which allows it to be
     *     cancelled.
     * @param {Object} anOrder A plain JS Object containing order fields.
     * @returns {Boolean} True if the order is pending etc.
     */

    return anOrder.status === 'pending';
});

//  ------------------------------------------------------------------------
//  Inst Handlers
//  ------------------------------------------------------------------------

APP.pizza.orderstatus.Inst.defineHandler('CancelOrder',
function(aSignal) {

    /**
     * @method handleCancelOrder
     * @summary Responds to requests to cancel the order by sending the order to
     *     the server for re-processing. NOTE that a true implementation would
     *     need to add flags etc. so the server could do something "real".
     * @param {TP.sig.Signal} aSignal The signal.
     */

    let app,
        order,
        request;

    app = TP.sys.getApplication();
    order = app.get('order');

    //  Prep the request as a JSON string and prevent any further encoding.
    request = TP.hc('body', TP.json(order), 'noencode', true);
    APP.debug(request);

    //  Send the order to the server for re-processing.
    TP.httpPost(app.get('serverURI'), request).then((result) => {
        APP.debug(result);
        //  Update the order with the server's augmented response data and
        //  notify any observers that the order data has changed.
        app.set('order', JSON.parse(result));
        app.orderChanged();
    }).catch((err) => {
        APP.error(err);
    });
});

//  ------------------------------------------------------------------------

APP.pizza.orderstatus.Inst.defineHandler('OrderChange',
function(aSignal) {

    /**
     * @method handleOrderChange
     * @summary Responds to notifications of order change by re-rendering the
     *     tag's content. The primary changes occur once the order is placed.
     * @param {TP.sig.Signal} aSignal The signal.
     */

    //  "recompile" and force the new content to replace existing content.
    this.compile(null, true);
});

//  ------------------------------------------------------------------------
//  end
//  ========================================================================
