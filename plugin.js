CKEDITOR.plugins.add( 'responsive_tables', {
  icons: 'icon',
  init: function( editor ) {
    //CKEDITOR.dialog.add( 'tableDialog', this.path + 'dialogs/responsive_tables.js' );
    CKEDITOR.dialog.add( 'openTableDialog', this.path + 'dialogs/responsive_tables.js' );
    CKEDITOR.dialog.add( 'RT-tableProperties', this.path + 'dialogs/responsive_tables.js' );

    editor.ui.addButton( 'Responsive Tables', {
      label: 'Create Responsive Table',
      command: 'openTableDialog',
      toolbar: 'insert',
      icon: this.path + 'icon.png'
    });

    editor.addCommand('openTableDialog', new CKEDITOR.dialogCommand('openTableDialog'));
    editor.addCommand('RT-tableProperties', new CKEDITOR.dialogCommand('RT-tableProperties', createDef() ) );

    // If the "menu" plugin is loaded, register the menu items.
    if ( editor.addMenuItems ) {
      editor.removeMenuItem('table');
      editor.addMenuItems( {
        rtTable: {
          label: 'Table Properties',
          command: 'RT-tableProperties',
          group: 'table',
          icon:  this.path + 'icon.png',
          order: 5
        }
      } );
    }

    function createDef( def ) {
      return CKEDITOR.tools.extend( def || {}, {
        contextSensitive: 1,
        refresh: function( editor, path ) {
          this.setState( path.contains( 'table', 1 ) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED );
        }
      } );
    }

    // If the "contextmenu" plugin is loaded, register the listeners.
    if ( editor.contextMenu ) {
      editor.contextMenu.addListener( function() {
        // menu item state is resolved on commands.
        return {
          rtTable: CKEDITOR.TRISTATE_OFF
        };
      } );
    }

  }
});