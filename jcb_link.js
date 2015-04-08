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

  /* set globals, essentially class attributes */
  var bibnum = null;
  var all_html = null;
  var title = null;
  var author = null;
  var publish_info = null;
  var callnumber = null;
  var aeon_root_url = "https://jcbl.aeon.atlas-sys.com/aeon.dll?Action=10&Form=30&";
  var full_aeon_url = null;

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
      grab_bib();
      // grab_bib_info()
    }  else {
      console.log( "- not bib page; done" );
    }
  }

  var grab_bib = function() {
    /* Grabs bib via #recordnum; then continues processing.
     * Called by check_page_type()
     */
    var elmnt = document.querySelector( "#recordnum" );
    var url_string = elmnt.href;
    var segments = url_string.split( "=" )[1];
    bibnum = segments.slice( 0,8 );
    console.log( "- bibnum, " + bibnum );
    grab_bib_info();
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
      grab_publish_info( label );
      if ( title != null && author != null && publish_info != null ) { break; }
    }
    grab_callnumber();
    build_url();
  }

  var grab_title = function( label ) {
    /* Sets class title attribute.
     * Called by grab_bib_info()
     */
    if ( title == null ) {
      var label_text = label.textContent.trim();
      if ( label_text == "Title" ) {
        title = label.nextElementSibling.textContent.trim();
        console.log( "- title, " + title );
      }
    }
  }

  var grab_author = function( label ) {
    /* Sets class author attribute.
     * Called by grab_bib_info()
     */
    if ( author == null ) {
      var label_text = label.textContent.trim();
      if ( label_text == "Author" ) {
        author = label.nextElementSibling.textContent.trim();
        console.log( "- author, " + author );
      }
    }
  }

  var grab_publish_info = function( label ) {
    /* Sets class publish_info attribute.
     * Called by grab_bib_info()
     */
    if ( publish_info == null ) {
      var label_text = label.textContent.trim();
      if ( label_text == "Published" ) {
        publish_info = label.nextElementSibling.textContent.trim();
        console.log( "- publish_info, " + publish_info );
      }
    }
  }

  var grab_callnumber = function( label ) {
    /* Sets class call_number attribute.
     * Called by grab_bib_info()
     */
    if ( callnumber == null ) {
      var row = document.querySelector( ".bibItemsEntry" );
      var td = row.children[1];
      for( var i=0; i < td.childNodes.length; i++ ) {
        var elmnt = td.childNodes[i];
        if ( elmnt.nodeType == Node.COMMENT_NODE ) {
          if ( elmnt.textContent.trim() == "field C" ) {
            callnumber = elmnt.nextElementSibling.textContent.trim();
            console.log( "- callnumber, " + callnumber );
            break;
          }
        }
      }
    }
  }

  var build_url = function() {
    /* Builds proper url for class attribute.
     * Called by grab_bib_info()
     */
    full_aeon_url = aeon_root_url +
      "&ReferenceNumber=" + bibnum +
      "&ItemTitle=" + encodeURIComponent(title) +
      "&ItemAuthor=" + encodeURIComponent(author) +
      "&ItemPublisher=" + encodeURIComponent(publish_info) +
      "&CallNumber=" + encodeURIComponent(callnumber)
      ;
    console.log( "- full_aeon_url, " + full_aeon_url );
    display_link();
  }

  var display_link = function() {
    /* Builds and displays link html.
     * Called by build_url()
     */
    console.log( "almost done!" );
  }

};  // end namespace jcblink_flow_manager, ```var jcblink_flow_manager = new function() {```


$(document).ready(
  function() {
    console.log( "- jcb_link.js says document loaded" );
    jcblink_flow_manager.check_already_run();
  }
);


console.log( "- jcb_link.js END" );
