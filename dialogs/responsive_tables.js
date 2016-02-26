//CKEDITOR.dialog.add( 'tableDialog', function ( editor ) {
( function() {
  function tableDialog( editor, command ) {
    return {
      title: 'Responsive Table Maker',
      minWidth: 400,
      minHeight: 300,

      contents: [
        {
          id: 'tab-basic',
          label: 'Table Properties',
          elements: [
            {
              type: 'hbox',
              widths: [ '25%', '25%'],
              style: "margin: 10px 0",
              children: [
                {
                  type: 'text',
                  id: 'rows',
                  label: 'Rows',
                  width: '40px'
                },
                {
                  type: 'text',
                  id: 'columns',
                  label: 'Columns',
                  width: '40px'
                }
              ]
            },
            //{//TODO: Fix validation
            //  type: 'text',
            //  id: 'rows',
            //  label: '# Rows (Table Header is included in this)'
            //  //validate: function () {
            //  //  var value = this.getValue();
            //  //
            //  //  if (value == 0 || value <= 1) {
            //  //    alert('The number of rows must be greater than 1, as the first row is the table header');
            //  //    return false;
            //  //  }
            //  //}
            //},
            //{
            //  type: 'text',
            //  id: 'columns',
            //  label: '# Columns'
            //  //validate: function () {
            //  //  if (this.getValue() == 0) {
            //  //    alert('The number of columns must be greater than 0');
            //  //    return false;
            //  //  }
            //  //}
            //},
            {
              type: 'radio',
              id: 'tableModes',
              style: "margin: 10px 0",
              label: 'Table Mode',//Makes the table sortable, swipe, or stack table (default)
              items: [['Stack (Default)', 'Stack'], ['Sortable'], ['Swipe']],
              default: 'Stack',
              //TODO: Create function to handle this cleaner
              commit: function( data, selectedTable ) {
                if ( this.getValue() ) {
                  //Strip all classes, but then add back in cbs-table and Tablesaw
                  selectedTable.removeClass('tablesaw-stack');
                  selectedTable.removeClass('tablesaw-sortable');
                  selectedTable.removeClass('tablesaw-swipe');
                  selectedTable.removeClass('tablesaw');
                  selectedTable.removeClass('cbs-table');
                  selectedTable.addClass('cbs-table');
                  selectedTable.addClass('tablesaw');

                  switch(this.getValue()) {
                    case 'Swipe':
                      selectedTable.addClass('tablesaw-swipe');
                      break;
                    case 'Sortable':
                      selectedTable.addClass('tablesaw-sortable');
                      selectedTable.addClass('tablesaw-stack');
                      break;
                    default:
                      selectedTable.addClass('tablesaw-stack');
                  }
                }
                else
                  selectedTable.removeClass('table-zebra-stripe');
              }
            },
            {//TODO: Make it remember if checked or not
              type: 'checkbox',
              id: 'zebra',
              label: 'Enable Alternate Row Coloring',//Adds a class to the table
              default: 'checked',
              commit: function( data, selectedTable ) {
                if ( this.getValue() )
                  selectedTable.addClass('table-zebra-stripe');
                else
                  selectedTable.removeClass('table-zebra-stripe');
              }
            }
          ]
        }
      ],
      onShow: function() {
        // Detect if there's a selected table.
        var selection = editor.getSelection();
        var ranges = selection.getRanges();
        var table;

        var rowsInput = this.getContentElement( 'tab-basic', 'rows' );
        var colsInput = this.getContentElement( 'tab-basic', 'columns' );

        if ( command == 'RT-tableProperties' ) {
          var selected = selection.getSelectedElement();
          if ( selected && selected.is( 'table' ) )
            table = selected;
          else if ( ranges.length > 0 ) {
            // Webkit could report the following range on cell selection (#4948):
            // <table><tr><td>[&nbsp;</td></tr></table>]
            if ( CKEDITOR.env.webkit )
              ranges[ 0 ].shrink( CKEDITOR.NODE_ELEMENT );

            table = editor.elementPath( ranges[ 0 ].getCommonAncestor( true ) ).contains( 'table', 1 );
          }

          // Save a reference to the selected table, and push a new set of default values.
          this._.selectedElement = table;
        }

        // Enable or disable the row, cols, width fields.
        if ( table ) {
          this.setupContent( table );
          rowsInput && rowsInput.getElement().hide();
          colsInput && colsInput.getElement().hide();
        } else {
          rowsInput && rowsInput.enable();
          colsInput && colsInput.enable();
        }
      },
      onOk: function () {
        var selection = editor.getSelection();
        var bms = this._.selectedElement && selection.createBookmarks();
        var table = this._.selectedElement || editor.document.createElement('table');
        var data = {};

        this.commitContent( data, table );

        //Table Options
        var rows = this.getValueOf('tab-basic', 'rows');
        var columns = this.getValueOf('tab-basic', 'columns');
        var advancedTableMode = this.getValueOf('tab-basic', 'tableModes');
        var zebraStripe = this.getValueOf('tab-basic', 'zebra');

        ////add a class if UI option is selected so it can be targeted via CSS
        //if (zebraStripe) {
        //  table.addClass('table-zebra-stripe');
        //}

        //create base table elements
        var thead = new CKEDITOR.dom.element('thead');
        var tbody = new CKEDITOR.dom.element('tbody');

        //TODO: Merge these into commit functions in element definitions
        //Set classes and data-attributes that Tablesaw library requires based on UI options. Default is Stack table
        switch (advancedTableMode) {
          case 'Sortable':
            //table.addClass('cbs-table tablesaw tablesaw-stack tablesaw-sortable');
            table.data('tablesaw-sortable', '');
            table.data('tablesaw-sortable-switch', '');
            break;
          case 'Swipe':
            //table.addClass('cbs-table tablesaw tablesaw-swipe');
            table.data('tablesaw-mode', 'swipe');
            break;
          default:
            //table.addClass('cbs-table tablesaw tablesaw-stack');
            table.data('tablesaw-mode', 'stack');
        }

        //Build table
        thead.appendTo(table);
        tbody.appendTo(table);

        for (var y = 0; y < rows; y++) {
          var tr = new CKEDITOR.dom.element('tr');

          //if first row, then it's table header
          if (y == 0) {
            tr.appendTo(thead);
          }
          else {
            tr.appendTo(tbody);
          }

          for (var x = 0; x < columns; x++) {
            //if first row, then add ths inside the table header, rather than tds
            if (y == 0) {
              var th = new CKEDITOR.dom.element('th');
              //If sortable option selected, add this data-attribute to headers to enable them to be sorted. Required by library
              if (advancedTableMode === 'Sortable') {
                //TODO: Make this a function and call in commit
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
        // Insert the table element if we're creating one.
        if ( !this._.selectedElement ) {
          editor.insertElement( table );
        }
        // Properly restore the selection, (#4822) but don't break
        // because of this, e.g. updated table caption.
        else {
          try {
            selection.selectBookmarks( bms );
          } catch ( er ) {
          }
        }
        //editor.insertElement(table);
      }
    };
  }

  CKEDITOR.dialog.add( 'openTableDialog', function( editor ) {
    return tableDialog( editor, 'openTableDialog' );
  } );
  CKEDITOR.dialog.add( 'RT-tableProperties', function( editor ) {
    return tableDialog( editor, 'RT-tableProperties' );
  } );
} )();
//});