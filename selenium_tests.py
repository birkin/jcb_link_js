# -*- coding: utf-8 -*-

""" python3 tests for classic-josiah jcb/aeon links """

import os, pprint, re, time, unittest
from urllib.parse import parse_qs, urlparse

from selenium import webdriver


class JCBlinkTest( unittest.TestCase ):
    """ Tests javascript-created JCB-Aeon links. """

    def setUp(self):
        self.driver = None
        driver_type = os.environ.get( 'JCBLINK_TESTS__DRIVER_TYPE', 'firefox' )
        if driver_type == 'firefox':
            self.driver = webdriver.Firefox()
        else:
            self.driver = webdriver.PhantomJS( '%s' % driver_type )  # will be path to phantomjs
        self.driver.implicitly_wait( 30 )
        # self.base_url = unicode( os.environ.get('JCBLINK_TESTS__BASE_URL') )
        self.base_url = 'http://josiah.brown.edu:2082'

    def tearDown(self):
        self.driver.quit()

    ## tests

    def test_JCB_plain( self ):
        """ Checks for link and link param-values for plain JCB location. """
        driver = self.driver
        driver.get(self.base_url + "/record=b3902979~S6")
        driver.find_element_by_link_text("Request").click()
        self.assertTrue( 'aeon' in driver.current_url )
        self.assertTrue( 'ReferenceNumber=b3902979' in driver.current_url )
        self.assertTrue( 'ItemTitle=Monticello' in driver.current_url )
        self.assertTrue( 'ItemAuthor=Garrett' in driver.current_url )
        self.assertTrue( 'ItemPublisher=New' in driver.current_url )
        self.assertTrue( 'CallNumber=1-SIZE' in driver.current_url )
        # self.assertTrue( 'Notes=(bibnum%3A%20b3902979)' in driver.current_url )
        self.assertEqual( 'ItemInfo2=', driver.current_url[-10:] )

    def test_JCB_plain_with_digital_version( self ):
        """ Checks for link and link param-values for plain JCB location but where item has digital online version. """
        driver = self.driver
        driver.get(self.base_url + "/record=b2225840~S6")
        driver.find_element_by_link_text("Request").click()
        self.assertTrue( 'aeon' in driver.current_url )
        self.assertTrue( 'ReferenceNumber=b2225840' in driver.current_url )
        self.assertTrue( 'ItemTitle=Argonautica' in driver.current_url )
        self.assertTrue( 'ItemAuthor=Usselincx' in driver.current_url )
        self.assertTrue( 'ItemPublisher=Gedruckt' in driver.current_url )
        self.assertTrue( 'CallNumber=1-SIZE' in driver.current_url )
        # self.assertTrue( 'Notes=(bibnum%3A%20b2225840)' in driver.current_url )
        self.assertTrue( 'ItemInfo2=https' in driver.current_url )

    def test_JCB_REF( self ):
        """ Checks for link and link param-values for JCB-REF location. """
        driver = self.driver
        driver.get(self.base_url + "/record=b6344512~S6")
        driver.find_element_by_link_text("Request").click()
        self.assertTrue( 'aeon' in driver.current_url )
        self.assertTrue( 'ReferenceNumber=b6344512' in driver.current_url )
        self.assertTrue( 'ItemTitle=The%20papers' in driver.current_url )
        self.assertTrue( 'ItemAuthor=Jefferson%2C%20Thomas' in driver.current_url )
        self.assertTrue( 'ItemPublisher=Princeton' in driver.current_url )
        self.assertTrue( 'CallNumber=E302' in driver.current_url )
        # self.assertTrue( 'Notes=(bibnum%3A%20b6344512)' in driver.current_url )
        self.assertEqual( 'ItemInfo2=', driver.current_url[-10:] )

    def test_JCB_VISUAL_MATERIALS( self ):
        """ Checks for link and link param-values for JCB-VISUAL-MATERIALS location. """
        driver = self.driver
        driver.get(self.base_url + "/record=b5660654~S6")
        driver.find_element_by_link_text("Request").click()
        self.assertTrue( 'aeon' in driver.current_url )
        self.assertTrue( 'ReferenceNumber=b5660654' in driver.current_url )
        self.assertTrue( 'ItemTitle=Thomas%20Jefferson' in driver.current_url )
        self.assertTrue( 'ItemAuthor=&ItemPublisher' in driver.current_url )
        self.assertTrue( 'ItemPublisher=Princeton' in driver.current_url )
        self.assertTrue( 'CallNumber=VHS' in driver.current_url )
        # self.assertTrue( 'Notes=(bibnum%3A%20b5660654)' in driver.current_url )
        self.assertEqual( 'ItemInfo2=', driver.current_url[-10:] )

    def test_very_long_title( self ):
        """ Checks link prepared for item with very long title which should be truncated. """
        driver = self.driver
        driver.get(self.base_url + "/record=b5713050~S6")
        driver.find_element_by_link_text("Request").click()
        url_obj = urlparse( driver.current_url )
        q_dct = parse_qs( driver.current_url )
        # print( 'q_dct, ```%s```' % pprint.pformat(q_dct) )
        self.assertEqual(
            'jcbl.aeon.atlas-sys.com',
            url_obj.netloc )
        self.assertEqual(
            ['b5713050'],
            q_dct['ReferenceNumber'] )
        self.assertEqual(
            ["The English-American his travail by sea and land: or, A new survey of the West-India's [sic], : containing a journall of three thousand and three hundred miles within the main land of America. Wher..."],
            q_dct['ItemTitle'] )
        self.assertEqual(
            ['Gage, Thomas, 1603?-1656'],
            q_dct['ItemAuthor'] )
        self.assertEqual(
            ['London : printed by R. Cotes, and are to be sold by Humphrey Blunden at the Castle in Cornhill, and Thomas Williams at the Bible in Little Britain, 1648'],
            q_dct['ItemPublisher'] )
        self.assertEqual(
            ['1-SIZE D648 .G133e'],
            q_dct['CallNumber'] )
        self.assertEqual(
            ['http://www.archive.org/details/englishamericanh00gage'],
            q_dct['ItemInfo2'] )

    # end class JCBlinkTest


if __name__ == '__main__':
    runner = unittest.TextTestRunner()
    unittest.main( verbosity=2, warnings='ignore' )  # python3; warnings='ignore' from <http://stackoverflow.com/a/21500796>
