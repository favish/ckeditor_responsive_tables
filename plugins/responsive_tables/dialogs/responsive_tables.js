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
        label: 'Options',
        elements: [
          {
            type: 'text',
            id: 'id',
            label: 'Id'
          }
        ]
      }
    ],
    onOk: function() {
      var dialog = this;
      var table = editor.document.createElement( 'table' );
      var rows = dialog.getValueOf('tab-basic', 'rows');
      var columns = dialog.getValueOf('tab-basic', 'columns');

      var thead = new CKEDITOR.dom.element('thead');
      var tbody = new CKEDITOR.dom.element('tbody');

      //Set classes and data-attributes that Tablesaw library requires
      table.addClass('cbs-table tablesaw tablesaw-stack');
      table.data('tablesaw-mode', 'stack');
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