( function() {

  //Remove table-specific classes, base Tablesaw class can stay, as all tables use it
  function stripClasses(selectedTable) {
    selectedTable.removeClass('tablesaw-stack');
    selectedTable.removeClass('tablesaw-sortable');
    selectedTable.removeClass('tablesaw-swipe');
  }

  //Strip data attributes that Tablesaw uses to init
  function stripDataAttributes(selectedTable) {
    selectedTable.data('tablesaw-sortable', false);
    selectedTable.data('tablesaw-sortable-switch', false);
    selectedTable.data('tablesaw-mode-stack', false);
    selectedTable.data('tablesaw-mode-swipe', false);
  }

  //Adds or removes data attribute to TH elements when table is in 'Sortable' mode
  function sortabledHeaders(selectedTable, option) {
    var headerList = selectedTable.find('th');
    var headerOption = null;

    if(option === 'add') {
      headerOption = ''
    }
    else {
      headerOption = false;
    }

    for(var x=0; x < headerList.count(); x++) {
      headerList.getItem(x).data('tablesaw-sortable-col', headerOption);
    }
  }

  // Whole-positive-integer validator.
  function validatorNum( msg ) {
    return function() {
      var value = this.getValue(),
        pass = !!( CKEDITOR.dialog.validate.integer()( value ) && value > 0 );

      if ( !pass ) {
        alert( msg ); // jshint ignore:line
        this.select();
      }

      return pass;
    };
  }

  function tableColumns( table ) {
    var cols = 0,
      maxCols = 0;
    for ( var i = 0, row, rows = table.$.rows.length; i < rows; i++ ) {
      row = table.$.rows[ i ], cols = 0;
      for ( var j = 0, cell, cells = row.cells.length; j < cells; j++ ) {
        cell = row.cells[ j ];
        cols += cell.colSpan;
      }

      cols > maxCols && ( maxCols = cols );
    }

    return maxCols;
  }

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
                  width: '40px',
                  validate: validatorNum(editor.lang.table.invalidRows),
                  setup: function( selectedElement ) {
                    this.setValue( selectedElement.$.rows.length );
                  },
                },
                {
                  type: 'text',
                  id: 'columns',
                  label: 'Columns',
                  width: '40px',
                  validate: validatorNum(editor.lang.table.invalidCols),
                  setup: function( selectedTable ) {
                    this.setValue( tableColumns( selectedTable ) );
                  },
                }
              ]
            },
            {
              type: 'radio',
              id: 'tableModes',
              style: "margin: 10px 0",
              label: 'Table Mode',//Makes the table sortable, swipe, or stack table (default)
              items: [['Stack (Default)', 'Stack'], ['Sortable'], ['Swipe']],
              'default': 'Stack',
              setup: function(selectedElement) {
                if(selectedElement.data('tablesaw-mode') === 'swipe') {
                  this.setValue('Swipe');
                }
                else if(selectedElement.data('tablesaw-sortable') === '') {
                  this.setValue('Sortable');
                }
                else {
                  this.setValue('Stack');
                }
              },
              commit: function( data, selectedTable ) {
                if ( this.getValue() ) {

                  stripClasses(selectedTable);
                  stripDataAttributes(selectedTable);

                  selectedTable.addClass('cbs-table');
                  selectedTable.addClass('tablesaw');

                  switch(this.getValue()) {
                    case 'Swipe':
                      sortabledHeaders(selectedTable);
                      selectedTable.addClass('tablesaw-swipe');
                      selectedTable.data('tablesaw-mode', 'swipe');
                      break;
                    case 'Sortable':
                      sortabledHeaders(selectedTable, 'add');
                      selectedTable.addClass('tablesaw-sortable');
                      selectedTable.addClass('tablesaw-stack');
                      selectedTable.data('tablesaw-mode', 'stack');
                      selectedTable.data('tablesaw-sortable', '');
                      selectedTable.data('tablesaw-sortable-switch', '');
                      break;
                    default:
                      sortabledHeaders(selectedTable);
                      selectedTable.addClass('tablesaw-stack');
                      selectedTable.data('tablesaw-mode', 'stack');
                  }
                }
              }
            },
            {
              type: 'checkbox',
              id: 'zebra',
              label: 'Enable Alternate Row Coloring',//Adds a class to the table
              'default': 'checked',
              setup: function(selectedTable) {
                if(selectedTable.hasClass('table-zebra-stripe')){
                  this.setValue('checked');
                }
                else {
                  this.setValue('');
                }
              },
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

        //create base table elements
        var thead = new CKEDITOR.dom.element('thead');
        var tbody = new CKEDITOR.dom.element('tbody');

        //Build table
        thead.appendTo(table);
        tbody.appendTo(table);

        if ( !this._.selectedElement ) {
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