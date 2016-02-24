# ckeditor-responsiveTables

## Installation

First, the module needs to be installed and enabled.

Navigate to `/admin/config/content/wysiwyg/filtered_html`, under the section `Buttons and Plugins` enable the checkbox next to `Responsive Tables`. At the bottom, under the tab CSS, for `CSS path`, add
`%t/assets/css/gsb.css` separated by a comma to the list. This will pull in the Columbia CSS (gsb.css in this case) file which themes tables into CKEditor, so tables viewed in CKEditor follow the same basic theming. You will
now have a Responsive Table icon on the CKEditor toolbar under Filtered HTML mode.

## Configuration

Navigate to `/admin/config/content/formats/filtered_html`, at the bottom, under the tab `Filter settings`, select `Limited allowed HTML tags`.
In the 'Allowed HTML tags' section add `<thead>` to the list. This allows the proper table structure and is required  by the library to work.

### Module Options

The module allows users to create responsive tables with various options directly through CKEditor. There is a new button called `Responsive Tables` that will bring up a dialog with
these options. Options include amount of rows/columns, type of table (default is stack), and whether or not to add a class that can be targetted for zebra striping. Currently this clas is not defined.
Default's are set to the current theme for tables.

To see examples of the various tables see the following:

Stack    - http://filamentgroup.github.io/tablesaw/demo/stack.html
Sortable - http://filamentgroup.github.io/tablesaw/demo/sort.html
Swipe    - http://filamentgroup.github.io/tablesaw/demo/swipe.html
