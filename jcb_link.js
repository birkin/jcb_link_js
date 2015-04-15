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
   *   - Build Aeon link
   *   - Builds link html
   *   - Displays Aeon link
   *
   * Reference Josiah pages:
   * - `JCB`: <http://josiah.brown.edu/record=b3902979~S6>
   * - `JCB REF`: <http://josiah.brown.edu/record=b6344512~S6>
   * - `JCB VISUAL MATERIALS`: <http://josiah.brown.edu/record=b5660654~S6>
   */

  /* set globals, essentially class attributes */
  var bibnum = null;
  var all_html = null;
  var title = null;
  var author = null;
  var publish_info = null;
  var callnumber = null;
  var bib_items_entry_row = null;
  var aeon_root_url = "https://jcbl.aeon.atlas-sys.com/aeon.dll?Action=10&Form=30";
  var full_aeon_url = null;

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
      bib_items_entry_row = document.querySelector( ".bibItemsEntry" );
      var td = bib_items_entry_row.children[1];
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
      "&CallNumber=" + encodeURIComponent(callnumber)
      ;
    console.log( "- full_aeon_url, " + full_aeon_url );
    // build_link_html( full_aeon_url );
    display_link( full_aeon_url );
  }

  // var build_link_html = function( full_aeon_url ) {
  //   /* Builds link html.
  //    * Called by build_url()
  //    */
  //   var link_html = '&nbsp;--&nbsp;<a class="jcb_link" href="THE_URL">(Request)</a>';
  //   link_html = link_html.replace( "THE_URL", full_aeon_url );
  //   console.log( "- link_html, " + link_html );
  //   display_link( link_html )
  // }

  var display_link = function( full_aeon_url ) {
    /* Displays link html.
     * Called by build_url()
     */
    console.log( "- starting display_link()" );
    var td = bib_items_entry_row.children[0];
    var dashes = document.createTextNode( " -- " );
    var a = document.createElement( "a" );
    // a.href = link_html;
    a.href = full_aeon_url;
    // a.class = "jcb_link";
    a.setAttribute( "class", "jcb_link" );
    var link_text = document.createTextNode( "Request" );
    a.appendChild( link_text );
    td.appendChild( dashes );
    td.appendChild( a );
    console.log( "- request-scan link added" );
  }

  // var display_link = function( link_html ) {
  //   /* Displays link html.
  //    * Called by build_link_html()
  //    */
  //   console.log( "- starting display_link()" );
  //   var td = bib_items_entry_row.children[0];
  //   for( var i=0; i < td.childNodes.length; i++ ) {
  //     var elmnt = td.childNodes[i];
  //     if ( elmnt.nodeType == Node.COMMENT_NODE && elmnt.textContent.trim() == "field 1" ) {
  //       var jcb_link_cell = grab_target_node( elmnt, td );
  //       $( jcb_link_cell ).after( link_html );
  //       break;
  //     }
  //   }
  //   console.log( "- request-scan link added" );
  // }

  var grab_target_node = function( elmnt, td ) {
    /* Sets and returns node to which Aeon link will be added.
     * Called by display_link()
     */
    var target_node = elmnt.nextElementSibling;
    if ( target_node == null || target_node == undefined ){  // handles errant case where JCB location is not a link, and weird Safari handling of `nextElementSibling`
      target_node = try_child_nodes();
      if ( target_node == null || target_node == undefined ){  // forces a node
        var node = document.createElement( "span" );
        td.appendChild( node );
        target_node = node;
      }
    }
    return target_node;
  }

  var try_child_nodes = function( td, target_node ) {
    /* Loops through cell's nodes looking for an element.
     * Called by display_link()
     */
    for( var i=0; i < td.childNodes.length; i++ ) {
      var child_node = td.childNodes[i];
      if ( child_node.nextElementSibling == null || child_node.nextElementSibling == undefined ){
        continue;
      } else {
        target_node = child_node.nextElementSibling;
        break;
      }
    }
    return target_node;
  }


  // var grab_target_node = function( elmnt, td ) {
  //   /* Sets and returns node to which Aeon link will be added.
  //    * Called by display_link()
  //    */
  //   var target_node = elmnt.nextElementSibling;
  //   if ( target_node == null || target_node == undefined ){  // handles errant case where JCB location is not a link, and weird Safari handling of `nextElementSibling`
  //     for( var i=0; i < td.childNodes.length; i++ ) {
  //       var child_node = td.childNodes[i];
  //       if ( child_node.nextElementSibling == null || child_node.nextElementSibling == undefined ){
  //         continue;
  //       } else {
  //         target_node = child_node.nextElementSibling;
  //         break;
  //       }
  //     }
  //     if ( target_node == null || target_node == undefined ){
  //       var nd = document.createElement( "span" );
  //       td.appendChild( nd );
  //       target_node = nd;
  //     }
  //   }
  //   return target_node;
  // }

  // var grab_target_node = function( elmnt, td ) {
  //   /* Sets and returns node to which Aeon link will be added.
  //    * Called by display_link()
  //    */
  //   console.log( "- elmnt ..." ); console.log( elmnt );
  //   console.log( "- td ..." ); console.log( td );
  //   console.log( "- elmnt.nextElementSibling before ..." ); console.log( elmnt.nextElementSibling );
  //   if ( elmnt.nextElementSibling == null || elmnt.nextElementSibling == undefined ){  // handles errant case where JCB location is not a link
  //     console.log( "- in `if`" );
  //     var nd = document.createElement( "span" );
  //     td.appendChild( nd );
  //     console.log( "- td after ..." ); console.log( td );
  //     console.log( "- td.children..." ); console.log( td.children );
  //     if ( elmnt.nextElementSibling == null ) {
  //       elmnt = elmnt.nextSibling.nextSibling;
  //     }
  //   }

  //   console.log( "- elmnt.nextElementSibling after ... " ); console.log( elmnt.nextElementSibling );
  //   return elmnt.nextElementSibling;
  // }

  // var grab_target_node = function( elmnt, td ) {
  //   /* Sets and returns node to which Aeon link will be added.
  //    * Called by display_link()
  //    */
  //    console.log( "- elmnt, " + elmnt );
  //    console.log( "- td, " + td );
  //    console.log( "- elmnt.nextElementSibling before, " + elmnt.nextElementSibling );
  //    if ( elmnt.nextElementSibling == null ){  // handles errant case where JCB location is not a link
  //      var nd = document.createElement( "span" );
  //      td.appendChild( nd );
  //    }
  //    console.log( "- elmnt.nextElementSibling after, " + elmnt.nextElementSibling );
  //    return elmnt.nextElementSibling;
  // }

};  // end namespace jcblink_flow_manager, ```var jcblink_flow_manager = new function() {```


$(document).ready(
  function() {
    console.log( "- jcb_link.js says document loaded" );
    jcblink_flow_manager.check_already_run();
  }
);


console.log( "- jcb_link.js END" );
