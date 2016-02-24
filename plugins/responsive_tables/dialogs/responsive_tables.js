CKEDITOR.dialog.add( 'tableDialog', function ( editor ) {
  return {
    title: 'Responsive Table Maker',
    minWidth: 400,
    minHeight: 200,

    contents: [
      {
        id: 'tab-basic',
        label: 'Table Properties',
        elements: [
          {
            type: 'text',
            id: 'rows',
            label: 'Rows (Table Header is included in this)',
            validate: CKEDITOR.dialog.validate.notEmpty( "Rows field cannot be empty." )
          },
          {
            type: 'text',
            id: 'columns',
            label: 'Columns',
            validate: CKEDITOR.dialog.validate.notEmpty( "Columns field cannot be empty." )
          },
          {
            type: 'radio',
            id: 'tableModes',
            label: 'Table Mode',//Makes the table sortable, swipe, or stack table (default)
            items: [ ['Stack'], ['Sortable'], ['Swipe'] ],
            default: 'Stack'
          },
          {
            type: 'checkbox',
            id: 'zebra',
            label: 'Enable Alternating Row Coloring'//Adds a class to the table so it can be targeted
          }
        ]
      }
    ],
    onOk: function() {
      //Grab values from dialog
      //Table Options
      var table = editor.document.createElement( 'table' );
      var rows = this.getValueOf('tab-basic', 'rows');
      var columns = this.getValueOf('tab-basic', 'columns');
      var advancedTableMode = this.getValueOf('tab-basic', 'tableModes');
      var zebraStripes = this.getValueOf('tab-basic', 'zebra');

      //add a class if UI option is selected so it can be targeted via CSS
      if(zebraStripes) {
        table.addClass('zebra-stripe-enabled');
      }

      //create base table elements
      var thead = new CKEDITOR.dom.element('thead');
      var tbody = new CKEDITOR.dom.element('tbody');

      //Set classes and data-attributes that Tablesaw library requires based on UI options. Default is Stack table
      switch(advancedTableMode) {
        case 'Sortable':
          table.addClass('cbs-table tablesaw tablesaw-stack tablesaw-sortable');
          table.data('tablesaw-sortable', '');
          table.data('tablesaw-sortable-switch', '');
          break;
        case 'Swipe':
          table.addClass('cbs-table tablesaw tablesaw-swipe');
          table.data('tablesaw-mode', 'swipe');
          break;
        default:
          table.addClass('cbs-table tablesaw tablesaw-stack');
          table.data('tablesaw-mode', 'stack');
      }

      //Build table
      thead.appendTo(table);
      tbody.appendTo(table);

      for(var y=0; y < rows; y++) {
        if(y == 0) {
          var tr = new CKEDITOR.dom.element('tr');
          tr.appendTo(thead);
        }
        else {
          var tr = new CKEDITOR.dom.element('tr');
          tr.appendTo(tbody);
        }

        for(var x=0; x < columns; x++) {
          if(y == 0) {
            var th = new CKEDITOR.dom.element('th');
            //If sortable option selected, add this data-attribute to headers to enable them to be sorted. Required by library
            if(advancedTableMode === 'Sortable') {
              th.data('tablesaw-sortable-col', '');
            }
            th.appendTo(tr);
          }
          else {
            var td = new CKEDITOR.dom.element('td');
            td.appendTo(tr);
          }
        }
      }
      editor.insertElement( table );
    }
  };
});