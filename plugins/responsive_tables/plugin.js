CKEDITOR.plugins.add( 'responsive_tables', {
  icons: 'table',
  init: function( editor ) {
    //Plugin logic goes here.
    CKEDITOR.dialog.add( 'tableDialog', this.path + 'dialogs/responsive_tables.js' );

    editor.ui.addButton( 'Responsive Tables', {
      label: 'Create Responsive Table',
      command: 'openTableDialog',
      toolbar: 'insert',
      icon: this.path + 'icons/table.png'
    });

    editor.addCommand('openTableDialog', new CKEDITOR.dialogCommand('tableDialog'));
  }
});