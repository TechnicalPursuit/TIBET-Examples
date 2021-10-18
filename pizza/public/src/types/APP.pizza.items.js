//  ========================================================================
/**
 * @type APP.pizza.items
 * @summary A mixin for managing the checkbox lists used in both the options and
 *     sides user interface tags.
 */
//  ------------------------------------------------------------------------

APP.pizza.Object.defineSubtype('APP.pizza.items');

//  Prevent instantiation. This type is intended for use as a mixin.
APP.pizza.items.Type.isAbstract(true);

//  ------------------------------------------------------------------------
//  Inst Attributes
//  ------------------------------------------------------------------------

//  Access path for locating all checkbox items under a target "body" div.
APP.pizza.items.Inst.defineAttribute('itemCheckboxes',
    TP.cpc('> div[class="body"] input[type="checkbox"]',
        TP.hc('shouldCollapse', false)));

//  ------------------------------------------------------------------------
//  Inst Methods
//  ------------------------------------------------------------------------

APP.pizza.items.Inst.defineMethod('getItems',
function() {

    /**
     * @method getItems
     * @summary Queries for and returns the current set of checkbox items found
     *     via the itemCheckboxes CSS path.
     * @returns {Array.<Element>} An array of Element instances.
     */

    let items;

    items = this.get('itemCheckboxes');

    return TP.ifInvalid(items, TP.ac());
});

//  ------------------------------------------------------------------------

APP.pizza.items.Inst.defineMethod('getSelectedItems',
function() {

    /**
     * @method getSelectedItems
     * @summary Returns the list of all selected checkbox items.
     * @returns {Array.<Element>} An array of Element instances.
     */

    return this.getItems().filter(function(node) {
        return node.isSelected();
    });
});

//  ------------------------------------------------------------------------

APP.pizza.items.Inst.defineMethod('getSelectedValues',
function() {

    /**
     * @method getSelectedValues
     * @summary Returns the list of all selected checkbox item values.
     * @returns {Array.<String>} An array of String values.
     */

    return this.getSelectedItems().map(function(node) {
        return node.getValue();
    });
});

//  ------------------------------------------------------------------------

APP.pizza.items.Inst.defineMethod('reset',
function() {

    /**
     * @method reset
     * @summary Reset all field values to their initial defaults.
     * @returns {APP.pizza.items} The receiver.
     */

    this.resetItems();

    return this;
});

//  ------------------------------------------------------------------------

APP.pizza.items.Inst.defineMethod('resetItems',
function() {

    /**
     * @method resetItems
     * @summary Clears the checked state on all checkbox instances.
     * @returns {APP.pizza.items} The receiver.
     */

    let list;

    list = this.getItems();
    list.forEach(function(node) {
        node.getNativeNode().checked = false;
    });

    return this;
});

//  ------------------------------------------------------------------------
//  Inst Handlers
//  ------------------------------------------------------------------------

APP.pizza.items.Inst.defineHandler('ToggleItem',
function(aSignal) {

    /**
     * @method handleToggleItem
     * @summary Responds to requests to toggle a checkbox item. This signal is
     *     typically fired from <label> elements associated with the inputs.
     * @param {TP.sig.Signal} aSignal The signal.
     */

    let name,
        path,
        item,
        node;

    name = aSignal.getPayload().at('name');
    path = '> div[class="body"] input[type="checkbox"][name="' + name + '"]';

    item = this.get(path);
    if (TP.isValid(item)) {
        node = item.getNativeNode();
        node.checked = !node.checked;
    }
});

//  ------------------------------------------------------------------------
//  end
//  ========================================================================
