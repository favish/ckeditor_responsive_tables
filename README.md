# ckeditor-responsiveTables

## Installation

First, the module needs to be installed and enabled.

Navigate to `/admin/config/content/wysiwyg/filtered_html`, under the section 'Buttons and Plugins' enable the checkbox next to "Responsive Tables". At the bottom, under the tab CSS, for CSS path, add
"%t/assets/css/gsb.css" separated by a comma to the list. This will pull in the CSS file which themes tables into CKEditor, so tables viewed in CKEditor follow the same basic theming. You will
now have a Responsive Table icon on the CKEditor toolbar under Filtered HTML mode.

## Configuration

Navigating to `/admin/config/content/formats/filtered_html`, at the bottom, under the tab 'Filter settings', select 'Limited allowed HTML tags'.
In the 'Allowed HTML tags' section add <thead> to the list.

### Module Options

The module allows users to create responsive tables with various options directly through CKEditor. There is a new button called "Responsive Tables" that will bring up a dialog with
these options. Options include amount of rows/columns, type of table (default is stack), border-size & color, header background-color, and zebra-stripe colors for alternating rows. Default's
are set to the current theme for tables.
