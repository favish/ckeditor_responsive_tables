CKEDITOR.plugins.add( 'responsive_tables', {
  icons: 'table',
  init: function( editor ) {
    CKEDITOR.dialog.add( 'tableDialog', this.path + 'dialogs/responsive_tables.js' );

    editor.ui.addButton( 'Responsive Tables', {
      label: 'Create Responsive Table',
      command: 'openTableDialog',
      toolbar: 'insert',
      icon: this.path + 'icon.png'
    });

    editor.addCommand('openTableDialog', new CKEDITOR.dialogCommand('tableDialog'));
  }
});