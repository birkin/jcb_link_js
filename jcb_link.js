console.log( "- jcb_link.js START" );


var jcblink_flow_manager = new function() {
  /* Namespaces function calls.
   *
   * See <http://stackoverflow.com/a/881611> for module-pattern reference.
   * Only check_already_run() can be called publicly, and only via ```esyscn.check_already_run();```.
   *
   * Controller class flow description:
   * - Determines page-type. If bib page...
   * - Attempts to grab data elements
   * - Finds all item-rows and for each row:
   *   - Calls namespace `jcblink_row_processor` to process the row, which builds the links
   *   - Deletes item-barcode html
   *
   * Reference:
   * - items page: <http://josiah.brown.edu/record=b4069600>
   * - holdings page: <http://josiah.brown.edu/search~S7?/.b4069600/.b4069600/1,1,1,B/holdings~4069600&FF=&1,0,>
   * - non-bib-holdings page: <http://josiah.brown.edu/search~S7?/tBiofizika/tbiofizika/1,4,5,B/holdings&FF=tbiofizika&1,,2>
   * - results page: <http://josiah.brown.edu/search~S11/?searchtype=X&searcharg=zen&searchscope=11&sortdropdown=-&SORT=D&extended=1&SUBMIT=Search&searchlimits=&searchorigarg=tzen>
   */

  var bibnum = null;
  var all_html = null;
  var title = null;
  var author = null;

  this.check_already_run = function() {
    /* Checks to see if javascript has already been run.
     * Called by document.ready()
     */
    all_html = $("body").html().toString();  // jquery already loaded (whew)
    var index = all_html.indexOf( "JCB Info" );
    if (index != -1) {
      console.log( "- aready run" );
    } else {
      console.log( "- not already run" );
      check_page_type();
    }
  }

  var check_page_type = function() {
    /* Checks if `PermaLink` is on page.
     * Called by check_already_run()
     */
    var index = all_html.indexOf( "PermaLink to this record" );
    if (index != -1) {
      console.log( "- on bib page" );
      grab_bib_info()
    }  else {
      console.log( "- not bib page; done" );
    }
  }

  var grab_bib_info = function() {
    /* Grabs title from bibInfoEntry class; then continues processing.
     * Called by check_already_run()
     */
    var main_bib_entry = document.querySelectorAll( ".bibInfoEntry" )[0];
    var labels = document.querySelectorAll( "td.bibInfoLabel" );
    for( var i=0; i < labels.length; i++ ) {
      var label = labels[i];
      grab_title( label );
      grab_author( label );
    }
    console.log( "- title, " + title );
    console.log( "- author, " + author );
  }

  var grab_title = function( label ) {
    /* Sets class title attribute.
     * Called by grab_bib_info()
     */
    if ( title == null ) {
      var label_text = label.textContent.trim()
      if ( label_text == "Title" ) {
        title = label.nextElementSibling.textContent.trim()
      }
    }
  }

  var grab_author = function( label ) {
    /* Sets class title attribute.
     * Called by grab_bib_info()
     */
    if ( title == null ) {
      var label_text = label.textContent.trim()
      if ( label_text == "Author" ) {
        author = label.nextElementSibling.textContent.trim()
      }
    }
  }

};  // end namespace jcblink_flow_manager, ```var jcblink_flow_manager = new function() {```


$(document).ready(
  function() {
    console.log( "- jcb_link.js says document loaded" );
    jcblink_flow_manager.check_already_run();
  }
);


console.log( "- jcb_link.js END" );
