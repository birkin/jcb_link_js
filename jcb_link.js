console.log( "- jcb_link.js START" );


var jcblink_flow_manager = new function() {
  /* Namespaces function calls.
   *
   * See <http://stackoverflow.com/a/881611> for module-pattern reference.
   * Minimizes chances that a function here will interfere with a similarly-named function in another imported js file.
   * Only check_already_run() can be called publicly, and only via ```jcblink_flow_manager.check_already_run();```.
   *
   * Controller class flow description:
   * - Determines page-type. If bib page...
   *   - Attempts to grab data elements
   *   - Builds Aeon link
   *   - Builds link html
   *   - Displays Aeon link
   *
   * Reference Josiah pages:
   * - `JCB`: <http://josiah.brown.edu/record=b3902979~S6>
   * - `JCB REF`: <http://josiah.brown.edu/record=b6344512~S6>
   * - `JCB VISUAL MATERIALS`: <http://josiah.brown.edu/record=b5660654~S6>
   * - `JCB - multiple copies`: <http://josiah.brown.edu/record=b2223864~S6>
   */

  /* set globals, essentially class attributes */
  var bibnum = null;
  var all_html = "";
  var title = "";
  var author = "";
  var publish_info = "";
  var callnumber = "";
  var digital_version_url = "";
  var bib_items_entry_rows = null;
  var bib_items_entry_row = null;
  var aeon_root_url = "https://jcbl.aeon.atlas-sys.com/aeon.dll?Action=10&Form=30";
  var full_aeon_url = "";

  this.check_already_run = function() {
    /* Checks to see if javascript has already been run.
     * Called by document.ready()
     */
    all_html = $("body").html().toString();  // jquery already loaded (whew)
    // var index = all_html.indexOf( "JCB Info" );
    var index = all_html.indexOf( 'class="jcb_link"' );
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
      check_location();
    }  else {
      console.log( "- not bib page; done" );
    }
  }

  var check_location = function() {
    /* Checks if any of the locations are JCB-relevant.
     * Called by check_page_type()
     */
    bib_items_entry_rows = document.querySelectorAll( ".bibItemsEntry" );
    var jcb_found = search_location_rows();
    if ( jcb_found == true ) {
        console.log( "- JCB bib found; proceeding" );
        grab_bib();
    } else {
        console.log( "- not jcb bib page; done" );
    }
  }

  var search_location_rows = function() {
    /* Iterates through the bibItemsEntry rows, looking for `JCB` locations.
     * Returns boolean.
     * Called by check_location()
     */
    var jcb_found = false;
    for( var i=0; i < bib_items_entry_rows.length; i++ ) {
        var row = bib_items_entry_rows[i];
        var josiah_location = row.children[0].textContent.trim();
        console.log( "- current josiah_location, `" + josiah_location + "`" );
        if ( josiah_location.slice(0, 3) == "JCB" ) {
            jcb_found = true;
            break;
        }
    }
    return jcb_found;
  }

  var grab_bib = function() {
    /* Grabs bib via #recordnum; then continues processing.
     * Called by check_location()
     */
    var elmnt = document.querySelector( "#recordnum" );
    var url_string = elmnt.href;
    var segments = url_string.split( "=" )[1];
    bibnum = segments.slice( 0,8 );
    console.log( "- bibnum, " + bibnum );
    grab_bib_info();
  }

  var grab_bib_info = function() {
    /* Grabs bib-info from bibInfoEntry class; then continues processing.
     * Called by grab_bib()
     */
    var main_bib_entry = document.querySelectorAll( ".bibInfoEntry" )[0];
    var labels = document.querySelectorAll( "td.bibInfoLabel" );
    for( var i=0; i < labels.length; i++ ) {
      var label = labels[i];
      grab_title( label );
      grab_author( label );
      grab_publish_info( label );
      if ( title != "" && author != "" && publish_info != "" ) { break; }
    }
    process_rows();
    // grab_callnumber();
    // check_online_link();
  }

  var process_rows = function() {
    for( var i=0; i < bib_items_entry_rows.length; i++ ) {
        var row = bib_items_entry_rows[i];
        console.log( '- calling row-processor' );
        jcblink_row_processor.process_item( row );
    }
  }

  var grab_title = function( label ) {
    /* Sets class title attribute.
     * Called by grab_bib_info()
     */
    if ( title == "" ) {
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
    if ( author == "" ) {
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
    if ( publish_info == "" ) {
      var label_text = label.textContent.trim();
      if ( label_text == "Published" ) {
        publish_info = label.nextElementSibling.textContent.trim();
        console.log( "- publish_info, " + publish_info );
      }
    }
  }

  // var grab_callnumber = function( label ) {
  //   /* Sets class call_number attribute.
  //    * Called by grab_bib_info()
  //    */
  //   if ( callnumber == "" ) {
  //     var td = bib_items_entry_row.children[1];  // bib_items_entry_row set by check_location()
  //     for( var i=0; i < td.childNodes.length; i++ ) {
  //       var elmnt = td.childNodes[i];
  //       if ( elmnt.nodeType == Node.COMMENT_NODE ) {
  //         if ( elmnt.textContent.trim() == "field C" ) {
  //           callnumber = td.textContent.trim();
  //           console.log( "- callnumber, " + callnumber );
  //           break;
  //         }
  //       }
  //     }
  //   }
  // }

  var check_online_link = function() {
    /* Checks for & grabs online link.
     * Called by grab_bib_info()
     */
    var bib_links = document.getElementsByClassName( "bibLinks" );
    if ( bib_links.length > 0 ) {
      var bib_link_text = bib_links[0].textContent;
      var index = bib_link_text.indexOf( "Digital Version" );
      if (index != -1) {
        var link = bib_links[0].getElementsByTagName( "a" )[0];
        digital_version_url = link.href;
      }
    }
    console.log( "- digital_version_url, " + digital_version_url );
    build_url();
  }

  var build_url = function() {
    /* Builds proper url for class attribute.
     * Called by grab_bib_info()
     */
    var full_aeon_url = aeon_root_url +
      "&ReferenceNumber=" + bibnum +
      "&ItemTitle=" + encodeURIComponent(title) +
      "&ItemAuthor=" + encodeURIComponent(author) +
      "&ItemPublisher=" + encodeURIComponent(publish_info) +
      "&CallNumber=" + encodeURIComponent(callnumber) +
      "&ItemInfo2=" + encodeURIComponent(digital_version_url)
      ;
    console.log( "- full_aeon_url, " + full_aeon_url );
    display_link( full_aeon_url );
  }

  var display_link = function( full_aeon_url ) {
    /* Displays link html.
     * Called by build_url()
     */
    console.log( "- starting display_link()" );
    var td = bib_items_entry_row.children[0];
    var dashes = document.createTextNode( " -- " );
    var a = document.createElement( "a" );
    a.href = full_aeon_url;
    a.setAttribute( "class", "jcb_link" );
    var link_text = document.createTextNode( "Request" );
    a.appendChild( link_text );
    td.appendChild( dashes );
    td.appendChild( a );
    console.log( "- request-scan link added" );
  }

};  // end namespace jcblink_flow_manager, ```var jcblink_flow_manager = new function() {```


var jcblink_row_processor = new function() {
  /*
   * Class flow description:
   *   - Determines whether to show a JCB-Request link
   *   - If so, grabs callnumber
   *   - Builds and displays JCB-Request link html
   */

  var local_row = null;
  var call_number = null;

  this.process_item = function( row ) {
    /* Processes each row.
     * Called by jcblink_flow_manager.process_item_table()
     */
    console.log( '- processing row' );
    local_row = row;
    var jcb_found = check_row_location();
    if ( jcb_found == true ) {
      callnumber = grab_callnumber();
    }
  }

  var check_row_location = function() {
    /* Checks for JCB location.
     * Returns boolean.
     * Called by process_item()
     */
    var jcb_found = false;
    var josiah_location = local_row.children[0].textContent.trim();
    console.log( "- row josiah_location, `" + josiah_location + "`" );
    if ( josiah_location.slice(0, 3) == "JCB" ) {
        jcb_found = true;
    }
    console.log( "- jcb_found, `" + jcb_found + "`" );
    return jcb_found;
  }

  var grab_callnumber = function() {
    /* Sets class call_number attribute.
     * Called by process_item()
     */
    var td = local_row.children[1];
    for( var i=0; i < td.childNodes.length; i++ ) {
      var elmnt = td.childNodes[i];
      if ( elmnt.nodeType == Node.COMMENT_NODE ) {
        if ( elmnt.textContent.trim() == "field C" ) {
          callnumber = td.textContent.trim();
          console.log( "- callnumber, " + callnumber );
          break;
        }
      }
    }
  }

  // this.process_item = function( row, title, cell_position_map, bibnum ) {
  //   /* Processes each row.
  //    * Called by esyscn_flow_manager.process_item_table()
  //    */
  //   init( cell_position_map, bibnum );
  //   var row_dict = extract_row_data( row );
  //   if ( evaluate_row_data(row_dict)["show_scan_button"] == true ) {
  //     if ( title == null && local_bibnum == null ) {
  //       title = grab_ancestor_title( row );
  //     }
  //     update_row( title, row_dict, row );
  //   }
  //   row.deleteCell( cell_position_map["barcode"] );
  // }

  var init = function( cell_position_map, bibnum ) {
    /* Sets class variables.
     * Called by process_item()
     */
     local_cell_position_map = cell_position_map;
     local_bibnum = bibnum;
     return;
  }

};  // end namespace jcblink_row_processor, ```var jcblink_row_processor = new function() {```




$(document).ready(
  function() {
    console.log( "- jcb_link.js says document loaded" );
    jcblink_flow_manager.check_already_run();
  }
);


console.log( "- jcb_link.js END" );
