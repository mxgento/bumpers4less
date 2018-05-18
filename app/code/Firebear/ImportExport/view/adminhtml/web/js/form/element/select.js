/**
 * @copyright: Copyright © 2017 Firebear Studio. All rights reserved.
 * @author   : Firebear Studio <fbeardev@gmail.com>
 */

define(
    [
    'jquery',
    'underscore',
    'Magento_Ui/js/form/element/select',
    'Firebear_ImportExport/js/form/element/general',
    'uiRegistry'
    ],
    function ($, _, Acstract, general, reg) {
        'use strict';

        return Acstract.extend(general).extend(
            {
                defaults: {
                    sourceExt       : null,
                    sourceOptions: null,
                    imports      : {
                        changeSource: '${$.parentName}.source_data_entity:value'
                    },
                    ajaxUrl: '',
                },
                initConfig  : function (config) {
                    this._super();
                    this.sourceOptions = $.parseJSON(this.sourceOptions);
                    return this;
                },
                changeSource: function (value) {
                    var self = this;
                    this.sourceExt = value;
                    var oldValue = this.value();
                    var data = JSON.parse(localStorage.getItem('list_values'));
                    var exists = 0;
                    if (data !== null && typeof data === 'object') {
                       if (value in data) {
                           exists = 1;
                           self.setOptions(data[value]);
                           self.value(oldValue);
                       }
                    }
                    if (exists == 0) {
                        var parent = reg.get(this.ns +'.' + this.ns + '.source_data_map_container.source_data_map');
                        parent.showSpinner(true);
                        $.ajax({
                            type: "POST",
                            url: this.ajaxUrl,
                            data: {entity: value},
                            success: function (array) {
                               var newData = JSON.parse(localStorage.getItem('list_values'));
                                if (newData === null) {
                                    newData = {};
                                }
                                newData[value] = array;
                                localStorage.setItem('list_values', JSON.stringify(newData));
                                self.setOptions(array);
                                self.value(oldValue);
                                parent.showSpinner(false);
                            }
                        });
                    }
                }
            }
        )
    }
);
