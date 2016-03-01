# ckeditor-responsiveTables

## Installation

First, the module needs to be installed and enabled.

Navigate to `/admin/config/content/wysiwyg/profile/filtered_html/edit`, under the section `Buttons and Plugins` enable the checkbox next to `Responsive Tables`. Optionally (but suggested) disable the checkbox next to `Table`, which is is the exsisting 
table plugin so as to prevent confusion for content creators. 
At the bottom, under the tab CSS, for `CSS path`, add
`%t/assets/css/gsb.css` and `%bsites/all/modules/contrib/ckeditor-responsiveTables/css/rt_editor.css` separated by a comma to the list. This will pull in the Columbia CSS (gsb.css in this case) and Tablesaw's base CSS file.
 This will ensure that tables viewed inside CKEditor will look like the tables created. You will
now have a Responsive Table icon on the CKEditor toolbar under Filtered HTML mode.

Navigate to `/admin/config/content/formats/filtered_html`, at the bottom, under the section `Filter settings`, select `Limited allowed HTML tags`.
In the 'Allowed HTML tags' section add `<thead>` to the list. This prevents table headers from being removed by filtering. 

### Module Options

The module allows users to create responsive tables with various options directly through CKEditor. There is a new button called `Responsive Tables` that will bring up a dialog with
these options. Options include amount of rows/columns, type of table (default is stack), and whether or not to add a class that can be targeted for zebra striping.
Default's are set to the current theme for tables. Also note that the number of rows includes the header, so a 3 row, 3 column table will produce one row as the table header, and two rows for data.

Right clicking on an exsisting table will bring up a context menu allowing the user to manipulate the table by adding/removing cows/columns, deleting a table, or altering the table properties (such as the table mode, and optional class).

To see examples of the various tables see the following:

1. Stack    - http://filamentgroup.github.io/tablesaw/demo/stack.html
2. Sortable - http://filamentgroup.github.io/tablesaw/demo/sort.html
3. Swipe    - http://filamentgroup.github.io/tablesaw/demo/swipe.html
