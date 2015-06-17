### about ###

jcb_link.js builds a link in [Josiah](https://josiah.brown.edu) to hand off to the [Aeon](http://www.atlas-sys.com/aeon/) service of the [John Carter Brown Library](http://www.brown.edu/Facilities/John_Carter_Brown_Library/).

on this page...

- notes
- license


### notes ###

- Code flow overview:
    - determines if page is a bib -- if not, stops; if so...
    - grabs title, author, publisher, and digital-url if available
    - for each row...
        - grabs callnumber
        - builds and displays link

- jcb_link.js code contact: birkin_diana@brown.edu


### license ###

The [MIT License](http://opensource.org/licenses/MIT) (MIT)

    Copyright (c) 2015 http://library.brown.edu/its/

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

---

_( formatted in [markdown](http://daringfireball.net/projects/markdown/) )_
