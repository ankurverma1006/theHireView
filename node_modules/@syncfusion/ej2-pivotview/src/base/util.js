import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * This is a file to perform common utility for OLAP and Relational datasource

 */
var PivotUtil = /** @class */ (function () {
    function PivotUtil() {
    }
    PivotUtil.getType = function (value) {
        var val;
        val = (value && value.getDay) ? (value.getHours() > 0 || value.getMinutes() > 0 ||
            value.getSeconds() > 0 || value.getMilliseconds() > 0 ? 'datetime' : 'date') : typeof (value);
        return val;
    };
    PivotUtil.resetTime = function (date) {
        date.setHours(0, 0, 0, 0);
        return date;
    };
    PivotUtil.getClonedData = function (data) {
        var clonedData = [];
        if (data) {
            for (var _i = 0, _a = data; _i < _a.length; _i++) {
                var item = _a[_i];
                var fields = Object.keys(item);
                var keyPos = 0;
                /* tslint:disable */
                var framedSet = {};
                /* tslint:enable */
                while (keyPos < fields.length) {
                    framedSet[fields[keyPos]] = item[fields[keyPos]];
                    keyPos++;
                }
                clonedData.push(framedSet);
            }
        }
        return clonedData;
    };
    PivotUtil.getClonedPivotValues = function (pivotValues) {
        var clonedSets = [];
        for (var i = 0; i < pivotValues.length; i++) {
            clonedSets[i] = [];
            for (var j = 0; j < pivotValues[i].length; j++) {
                if (pivotValues[i][j]) {
                    clonedSets[i][j] = this.getClonedObj(pivotValues[i][j]);
                }
            }
        }
        return clonedSets;
    };
    PivotUtil.getClonedObj = function (data) {
        var keyPos = 0;
        /* tslint:disable */
        var framedSet = {};
        /* tslint:enable */
        if (!(data === null || data === undefined)) {
            var fields = Object.keys(data);
            while (keyPos < fields.length) {
                framedSet[fields[keyPos]] = data[fields[keyPos]];
                keyPos++;
            }
        }
        else {
            framedSet = data;
        }
        return framedSet;
    };
    PivotUtil.inArray = function (value, collection) {
        for (var i = 0, cnt = collection.length; i < cnt; i++) {
            if (collection[i] === value) {
                return i;
            }
        }
        return -1;
    };
    PivotUtil.getClonedDataSourceSettings = function (dataSourceSettings) {
        var clonesDataSource = {
            catalog: dataSourceSettings.catalog,
            cube: dataSourceSettings.cube,
            providerType: dataSourceSettings.providerType,
            url: dataSourceSettings.url,
            localeIdentifier: dataSourceSettings.localeIdentifier,
            excludeFields: isNullOrUndefined(dataSourceSettings.excludeFields) ? [] : dataSourceSettings.excludeFields.slice(),
            expandAll: dataSourceSettings.expandAll,
            allowLabelFilter: dataSourceSettings.allowLabelFilter,
            allowValueFilter: dataSourceSettings.allowValueFilter,
            enableSorting: dataSourceSettings.enableSorting ? true : false,
            rows: extend([], dataSourceSettings.rows, null, true),
            columns: extend([], dataSourceSettings.columns, null, true),
            filters: extend([], dataSourceSettings.filters, null, true),
            filterSettings: extend([], dataSourceSettings.filterSettings, null, true),
            sortSettings: extend([], dataSourceSettings.sortSettings, null, true),
            drilledMembers: extend([], dataSourceSettings.drilledMembers, null, true),
            valueSortSettings: extend({}, dataSourceSettings.valueSortSettings, null, true),
            valueAxis: dataSourceSettings.valueAxis,
            formatSettings: extend([], dataSourceSettings.formatSettings, null, true),
            calculatedFieldSettings: extend([], dataSourceSettings.calculatedFieldSettings, null, true),
            showSubTotals: dataSourceSettings.showSubTotals,
            showRowSubTotals: dataSourceSettings.showRowSubTotals,
            showColumnSubTotals: dataSourceSettings.showColumnSubTotals,
            showGrandTotals: dataSourceSettings.showGrandTotals,
            showRowGrandTotals: dataSourceSettings.showRowGrandTotals,
            showColumnGrandTotals: dataSourceSettings.showColumnGrandTotals,
            showHeaderWhenEmpty: dataSourceSettings.showHeaderWhenEmpty,
            alwaysShowValueHeader: dataSourceSettings.alwaysShowValueHeader,
            conditionalFormatSettings: extend([], dataSourceSettings.conditionalFormatSettings, null, true),
            emptyCellsTextContent: dataSourceSettings.emptyCellsTextContent,
            groupSettings: extend([], dataSourceSettings.groupSettings, null, true)
        };
        return clonesDataSource;
    };
    PivotUtil.updateDataSourceSettings = function (control, dataSourceSettings) {
        if (control) {
            /* tslint:disable */
            control.setProperties({
                dataSourceSettings: {
                    catalog: dataSourceSettings.catalog,
                    cube: dataSourceSettings.cube,
                    providerType: dataSourceSettings.providerType,
                    url: dataSourceSettings.url,
                    localeIdentifier: dataSourceSettings.localeIdentifier,
                    excludeFields: isNullOrUndefined(dataSourceSettings.excludeFields) ? [] : dataSourceSettings.excludeFields,
                    expandAll: dataSourceSettings.expandAll,
                    allowLabelFilter: dataSourceSettings.allowLabelFilter,
                    allowValueFilter: dataSourceSettings.allowValueFilter,
                    enableSorting: dataSourceSettings.enableSorting ? true : false,
                    rows: dataSourceSettings.rows,
                    columns: dataSourceSettings.columns,
                    filters: dataSourceSettings.filters,
                    filterSettings: dataSourceSettings.filterSettings,
                    sortSettings: dataSourceSettings.sortSettings,
                    drilledMembers: dataSourceSettings.drilledMembers,
                    valueSortSettings: dataSourceSettings.valueSortSettings,
                    valueAxis: dataSourceSettings.valueAxis,
                    formatSettings: dataSourceSettings.formatSettings,
                    calculatedFieldSettings: dataSourceSettings.calculatedFieldSettings,
                    showSubTotals: dataSourceSettings.showSubTotals,
                    showRowSubTotals: dataSourceSettings.showRowSubTotals,
                    showColumnSubTotals: dataSourceSettings.showColumnSubTotals,
                    showGrandTotals: dataSourceSettings.showGrandTotals,
                    showRowGrandTotals: dataSourceSettings.showRowGrandTotals,
                    showColumnGrandTotals: dataSourceSettings.showColumnGrandTotals,
                    showHeaderWhenEmpty: dataSourceSettings.showHeaderWhenEmpty,
                    alwaysShowValueHeader: dataSourceSettings.alwaysShowValueHeader,
                    conditionalFormatSettings: dataSourceSettings.conditionalFormatSettings,
                    emptyCellsTextContent: dataSourceSettings.emptyCellsTextContent,
                    groupSettings: dataSourceSettings.groupSettings
                }
            }, true);
        }
    };
    return PivotUtil;
}());
export { PivotUtil };
