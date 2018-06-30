// Import Chromeless and necessary modules

const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const merge = require('easy-pdf-merge');
const {login} = require("./modules/roblox");
const { ipcRenderer } = require('electron');
const fs = require('fs');
// Handle form submits
const form = document.querySelector("form");

let Data = {
  message: "Hello World !"
};


form.addEventListener("submit", submitForm);

function submitForm(e) {
  // Do not perform standard form action (POST to page)
  e.preventDefault();
  // Get values from form
  const details = [
    "username",
    "password",
  ].reduce(
    (acc, val) => ({
      ...acc,
      [val]: document.querySelector(`#${val}`).value
    }),
    {}
  );
  $('.status').text("Status: Started!");
  async function run() {

    const preparePageForTests = async (page) => {
      // Pass the User-Agent Test.
      const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
      await page.setUserAgent(userAgent);
    
      // Pass the Webdriver Test.
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
          get: () => false,
        });
      });
    
      // Pass the Chrome Test.
      await page.evaluateOnNewDocument(() => {
        // We can mock this in as much depth as we need for the test.
        window.navigator.chrome = {
          runtime: {},
          // etc.
        };
      });
    
      // Pass the Permissions Test.
      await page.evaluateOnNewDocument(() => {
        const originalQuery = window.navigator.permissions.query;
        return window.navigator.permissions.query = (parameters) => (
          parameters.name === 'notifications' ?
            Promise.resolve({ state: Notification.permission }) :
            originalQuery(parameters)
        );
      });
    
      // Pass the Plugins Length Test.
      await page.evaluateOnNewDocument(() => {
        // Overwrite the `plugins` property to use a custom getter.
        Object.defineProperty(navigator, 'plugins', {
          // This just needs to have `length > 0` for the current test,
          // but we could mock the plugins too if necessary.
          get: () => [1, 2, 3, 4, 5],
        });
      });
    
      // Pass the Languages Test.
      await page.evaluateOnNewDocument(() => {
        // Overwrite the `plugins` property to use a custom getter.
        Object.defineProperty(navigator, 'languages', {
          get: () => ['en-US', 'en'],
        });
      });
    }

    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true,
    });
    const page = await browser.newPage();
    await page.setViewport({height:1920, width:1080});
    // Prepare for the tests
    await preparePageForTests(page);
/*
    await page.goto(details.item,{waitUntil:'networkidle0'});

    const pagedetails = await page.evaluate(() => {
      return {
        sizes: Array.from(
          document.querySelectorAll(
            "div[data-auto-id=size-selector] > div:first-of-type > div > div > ul > li"
          )
        ).map(i => i.title),
        location: window.location
      };
    });
    
*/  
    console.log("started");
    await login(details, page)
    //await addToCart(pagenumber, page);


  }

  // Error logging
  run().catch(console.error.bind(console));
} //running

// When the action-update-label event is triggered (from the main process)
// Do something in the view
/*

*/