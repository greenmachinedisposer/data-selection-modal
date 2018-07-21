var MaterialManagementSystem =  {};
MaterialManagementSystem.DataSelectionModal = MaterialManagementSystem.DataSelectionModal || {};

MaterialManagementSystem.DataSelectionModal = function (targetContainerSelector, options) {
    var self = this;
    if(!targetContainerSelector)
        throw "Invalid container selector";
    if(!options)
        throw "Must specify options";
    var data = options.data || [];
    var columnHeaders = options.headers || [];
    var properties = options.properties || [];
    var renderCallbacks = options.renderCallbacks || [];
    var columnConfig = this.initColumns(columnHeaders, properties, data, renderCallbacks);
    var options
    this.isMultiSelect = options.isMultiSelect;
    options.order = options.order || [];
    if(options.order[0])
        throw "Invalid order index, must be greater than 0";
    var order = options.order || [1,'asc'];
    this.table = $(targetContainerSelector).DataTable({
        buttons: [
            'selectAll',
            'selectNone'
        ],
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
    });
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
        for(var i = 0; i < columnHeaders.length; i ++){
            var header = columnHeaders[i];
            var property = dataProperties[i];
            var callback = i===0?function(){return "";}:renderCallBacks[i]|null;
            if(!header instanceof String){
                throw "Headers must be a string";
            }
            else {
                var column = {};
                if(firstEntryObject instanceof Object){
                    var columnData = firstEntryObject[property] || '';
                    if(!isNaN(columnData.data)){
                        // Shift all data index to the right to allocate for Checkboxes/Radio buttons on the first column
                        columnTargetsWithNumericalContent.push(i+1);
                    }
                    else{
                        //DO NOTHING
                    }
                    column.title = header;
                    column.data = property;
                    if(callback) column.render = callback;
                    columns.push(column);
                }
            }
        }
        columnDefs.push({target : 0, orderable: false, searchable: false, className: 'select-radio'});
        columnDefs.push({target : columnTargetsWithNumericalContent, className: 'numeric-cell-content'});
    }
    return {
        columns : columns,
        columnDefs : columnDefs,
        data : data
    }
};


MaterialManagementSystem.DataSelectionModal.prototype.saveState = function (data) {
    console.log(data);
};