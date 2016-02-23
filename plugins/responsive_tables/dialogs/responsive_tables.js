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
            label: 'Rows',
            validate: CKEDITOR.dialog.validate.notEmpty( "Rows field cannot be empty." )
          },
          {
            type: 'text',
            id: 'columns',
            label: 'Columns',
            validate: CKEDITOR.dialog.validate.notEmpty( "Columns field cannot be empty." )
          }
        ]
      },
      {
        id: 'tab-adv',
        label: 'Table Options',
        elements: [
          {
            type: 'radio',
            id: 'tableModes',
            label: 'Advanced Table Modes',//Makes the table sortable or a swipe table
            items: [ ['Sortable'], ['Swipe'] ]
          },
          {
            type: 'text',
            id: 'evenColor',
            label: 'Even Row Color',
            default: '#ffffff'//from their CSS, their base even zebra color is just white
          },
          {
            type: 'text',
            id: 'oddColor',
            label: 'Odd Row Color',
            default: '#FEF6E8'//from their CSS, this is the zebra odd row color
          },
          {
            type: 'text',
            id: 'headerColor',
            label: 'Table Header Color'//Sets the table header color
          },
          {
            type: 'text',
            id: 'fontColor',
            label: 'Font Color'//Sets all font color in the table
          }
        ]
      }
    ],
    onOk: function() {
      var dialog = this;
      var table = editor.document.createElement( 'table' );
      var rows = dialog.getValueOf('tab-basic', 'rows');
      var columns = dialog.getValueOf('tab-basic', 'columns');
      var advancedTableMode = dialog.getValueOf('tab-adv', 'tableModes');

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
            //If sortable option selected, add this data-attribute to headers to enable them to be sorted
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