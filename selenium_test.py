# -*- coding: utf-8 -*-

import os, re, time, unittest
from selenium import webdriver


class JCBlinkTest( unittest.TestCase ):
    """ Tests javascript-created JCB-Aeon links. """

    def setUp(self):
        self.driver = None
        # driver_type = unicode( os.environ.get('JCBLINK_TESTS__DRIVER_TYPE') )
        driver_type = u'firefox'
        if driver_type == u'firefox':
            self.driver = webdriver.Firefox()
        else:
            self.driver = webdriver.PhantomJS( u'%s' % driver_type )  # will be path to phantomjs
        self.driver.implicitly_wait( 30 )
        # self.base_url = unicode( os.environ.get('JCBLINK_TESTS__BASE_URL') )
        self.base_url = u'http://josiah.brown.edu:2082'

    def tearDown(self):
        self.driver.quit()

    ## tests

    def test_JCB_plain( self ):
        """ Checks for link and link param-values for plain JCB location. """
        driver = self.driver
        driver.get(self.base_url + "/record=b3902979~S6")
        driver.find_element_by_link_text("Request").click()
        self.assertTrue( u'aeon' in driver.current_url )
        self.assertTrue( u'ReferenceNumber=b3902979' in driver.current_url )
        self.assertTrue( u'ItemTitle=Monticello' in driver.current_url )
        self.assertTrue( u'ItemAuthor=Garrett' in driver.current_url )
        self.assertTrue( u'ItemPublisher=New' in driver.current_url )
        self.assertTrue( u'CallNumber=1-SIZE' in driver.current_url )
        # self.assertTrue( u'ItemInfo2=not_applicable' in driver.current_url )

    def test_JCB_plain_with_digital_version( self ):
        """ Checks for link and link param-values for plain JCB location but where item has digital online version. """
        driver = self.driver
        driver.get(self.base_url + "/record=b2225840~S6")
        driver.find_element_by_link_text("Request").click()
        self.assertTrue( u'aeon' in driver.current_url )
        self.assertTrue( u'ReferenceNumber=b2225840' in driver.current_url )
        self.assertTrue( u'ItemTitle=Argonautica' in driver.current_url )
        self.assertTrue( u'ItemAuthor=Usselincx' in driver.current_url )
        self.assertTrue( u'ItemPublisher=Gedruckt' in driver.current_url )
        self.assertTrue( u'CallNumber=1-SIZE' in driver.current_url )
        # self.assertTrue( u'ItemInfo2=https' in driver.current_url )

    def test_JCB_REF( self ):
        """ Checks for link and link param-values for JCB-REF location. """
        driver = self.driver
        driver.get(self.base_url + "/record=b6344512~S6")
        driver.find_element_by_link_text("Request").click()
        self.assertTrue( u'aeon' in driver.current_url )
        self.assertTrue( u'ReferenceNumber=b6344512' in driver.current_url )
        self.assertTrue( u'ItemTitle=The%20papers' in driver.current_url )
        self.assertTrue( u'ItemAuthor=Jefferson%2C%20Thomas' in driver.current_url )
        self.assertTrue( u'ItemPublisher=Princeton' in driver.current_url )
        self.assertTrue( u'CallNumber=E302' in driver.current_url )
        # self.assertTrue( u'ItemInfo2=not_applicable' in driver.current_url )

    def test_JCB_VISUAL_MATERIALS( self ):
        """ Checks for link and link param-values for JCB-VISUAL-MATERIALS location. """
        driver = self.driver
        driver.get(self.base_url + "/record=b5660654~S6")
        driver.find_element_by_link_text("Request").click()
        self.assertTrue( u'aeon' in driver.current_url )
        self.assertTrue( u'ReferenceNumber=b5660654' in driver.current_url )
        self.assertTrue( u'ItemTitle=Thomas%20Jefferson' in driver.current_url )
        self.assertTrue( u'ItemAuthor=null' in driver.current_url )
        self.assertTrue( u'ItemPublisher=Princeton' in driver.current_url )
        self.assertTrue( u'CallNumber=VHS' in driver.current_url )
        # self.assertTrue( u'ItemInfo2=not_applicable' in driver.current_url )

    # end class JCBlinkTest


if __name__ == "__main__":
    runner = unittest.TextTestRunner( verbosity=3 )
    unittest.main( testRunner=runner )  # python2
    # unittest.main( verbosity=2, warnings='ignore' )  # python3; warnings='ignore' from <http://stackoverflow.com/a/21500796>
