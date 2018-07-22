var MaterialManagementSystem =  {};
MaterialManagementSystem.DataSelectionModal = MaterialManagementSystem.DataSelectionModal || {};

MaterialManagementSystem.DataSelectionModal = function (targetContainerSelector, options) {
    var opt = this.validateParameters(targetContainerSelector, options);
    var columnConfig = this.initColumns(opt.columnHeaders, opt.properties, opt.data, opt.renderCallbacks);
    this.isMultiSelect = options.isMultiSelect;
    var order = options.order || [1,'asc'];

    $.fn.dataTable.ext.errMode = 'none';
    this.table = $(targetContainerSelector).DataTable({
        dom: 'lfrtipSB',
        buttons : ['selectAll', 'selectNone'],
        stateSave : true,
        stateSaveCallback : this.saveState,
        columns : columnConfig.columns,
        columnDefs : columnConfig.columnDefs,
        data : columnConfig.data,
        order : order,
        select : {
            style : this.isMultiSelect? 'mutli-shit' : 'single',
            selector: this.isMultiSelect? 'td:first-child' : ''
        }
    }).on('error.dt',function (e,settings, techNote, message) {
        console.log( 'An error has been reported by DataTables: ', message );
    });



    return this.table;
};
var renderDefault = function (data) {
    var toBeRendered;
    if(!data)
        toBeRendered = "";
    else
        toBeRendered = data;
    return toBeRendered
};

MaterialManagementSystem.DataSelectionModal.prototype.initColumns = function (columnHeaders, dataProperties, data, renderCallBacks) {

    var columns = [];
    var columnDefs = [];
    if(!data || !(data instanceof Array))
        throw "data is not an array";
    else if(!columnHeaders || !(columnHeaders instanceof Array))
        throw "columnHeaders is not an array";
    else if( !dataProperties || !(dataProperties instanceof Array))
        throw "dataProperties is not an array";
    else if(!renderCallBacks instanceof Array && renderCallBacks!==null)
        throw "renderCallBacks is not an array";
    else if(columnHeaders.length!==dataProperties.length)
        throw "length of both column headers and data properties must match";
    else{
        var firstEntryObject = data[0] || {}; // Getting a sample object of the data
        var columnTargetsWithNumericalContent = [];
        columnHeaders.unshift(" ");
        dataProperties.unshift("checked");
        renderCallBacks = renderCallBacks || [];
        renderCallBacks.unshift(renderDefault);
        for(var i = 0; i < columnHeaders.length; i ++){
            var header = columnHeaders[i];
            var property = dataProperties[i];
            var callback = renderCallBacks[i];
            if(!header instanceof String){
                throw "Headers must be a string";
            }
            else {
                var column = {};
                if(firstEntryObject instanceof Object){
                    column.title = header;
                    column.data = property;
                    if(callback) column.render = callback;
                    columns.push(column);
                }
            }
        }
        columnDefs.push({targets : [0], orderable: false, searchable: false, className: 'select-checkbox'});
    }
    return {
        columns : columns,
        columnDefs : columnDefs,
        data : data
    }
};

MaterialManagementSystem.DataSelectionModal.prototype.saveState = function (data) {
    console.log();
};

MaterialManagementSystem.DataSelectionModal.prototype.validateParameters = function (targetContainerSelector, options) {
    if(!targetContainerSelector)
        throw "Invalid container selector";
    if(!options)
        throw "Must specify options";
    var data = options.data || [];
    var columnHeaders = options.headers || [];
    var properties = options.properties || [];
    var renderCallbacks = options.renderCallbacks || [];
    options.order = options.order || [];
    if(options.order[0])
        throw "Invalid order index, must be greater than 0";

    return {
        data : data,
        columnHeaders : columnHeaders,
        properties : properties,
        renderCallbacks : renderCallbacks
    }
};