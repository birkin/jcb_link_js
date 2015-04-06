console.log( "- jcb_link.js START" );


var jcblink_flow_manager = new function() {
  /* Namespaces function calls.
   *
   * See <http://stackoverflow.com/a/881611> for module-pattern reference.
   * Only check_already_run() can be called publicly, and only via ```esyscn.check_already_run();```.
   *
   * Controller class flow description:
   * - Determines page-type. If bib page...
   * - Attempts to grab bib & title
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

  this.check_already_run = function() {
    /* Checks to see if javascript has already been run.
     * Called by document.ready()
     */
    var all_html = $("body").html().toString();  // jquery already loaded (whew)
    var index = all_html.indexOf( "Request Scan" );
    if (index != -1) {
      console.log( "- aready run" );
    } else {
      console.log( "- not already run" );
      grab_title();
    }
  }

  var grab_title = function() {
    /* Tries to grab bib title from `items` page; then continues processing.
     * Called by check_already_run()
     */
    var title = null;
    var els = document.querySelectorAll( ".bibInfoData" );
    if ( els.length > 0 ) {
      var el = els[0];
      title = el.textContent.trim();
    }
    console.log( "- title, " + title );
    if ( title == null ){
      // check_holdings_html();
      console.log( "foo" );
    } else {
      // process_item_table( title );
      console.log( "bar" );
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
