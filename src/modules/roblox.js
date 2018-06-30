

const login = async (details, page) => {
  
    await page.goto("https://www.roblox.com/newlogin",{waitUntil:'networkidle0'});//login
    await page.type( "#login-username",details.username,{delay: 10});
    await page.type("#login-password", details.password,{delay: 10});
    await page.click("#login-button");

  setTimeout(async function(){
    await page.goto("https://www.roblox.com/my/messages/#!/inbox");
  }, 3000)
  $('.status').text("Status: Logged In");
  setTimeout(async function(){

  }, 6000)

  setTimeout(async ()=>{
    const text = await page.evaluate(() => document.querySelector('.TotalPages.ng-binding').textContent);
    console.log("done");
    console.log(text);
    const pagenumber = parseInt(text);
    console.log(pagenumber);
    $('.status').text("Status: Extracting. May take some time!");
    pagetopdf(pagenumber, page);
 },6000)

}
const pagetopdf = async (pages, page) => {
  var globalmessagenumber = 0;
  for (pagenumber = 0; pagenumber < pages+1; pagenumber++) {
    if(pagenumber == 0){
      for (messagenumber = 0; messagenumber < 20; messagenumber++) {
          if (messagenumber == 0){
            /*Compute the Progress Bar */
            $('.progress-bar').text(`${barvalue}%`);
            $('.progress-bar').css('width', barvalue+'%').attr('aria-valuenow', barvalue);
            var barvalue = (((globalmessagenumber / (pages * 20)) * 100));
            barvalue = barvalue.toFixed(1);
            console.log(barvalue);
            /* Extract the message as a PDF and append it*/
            $('.status').text(`Status: Extracting page 1 and message 1`);
            await page.goto(`https://www.roblox.com/my/messages/#!/inbox?messageIdx=${messagenumber}`);
            var pdfFileName =  `./pdfs/final.pdf`;
            await page.pdf({ path: pdfFileName, format: 'A4' });
            globalmessagenumber++;
          }
          else{
            /*Compute the Progress Bar */
            $('.progress-bar').text(`${barvalue}%`);
            $('.progress-bar').css('width', barvalue+'%').attr('aria-valuenow', barvalue);
            var barvalue = (((globalmessagenumber / (pages * 20)) * 100));
            barvalue = barvalue.toFixed(1);
            console.log(barvalue);
            /* Extract the message as a PDF and append it*/
            $('.status').text(`Status: Extracting page ${pagenumber+1} and message ${messagenumber+1}`);
            await page.goto(`https://www.roblox.com/my/messages/#!/inbox?messageIdx=${messagenumber}`);
            var pdfFileName =  `./pdfs/pdf_page_0_number${messagenumber}.pdf`;
            await page.pdf({ path: pdfFileName, format: 'A4' });
            await mergeMultiplePDF(["./pdfs/final.pdf", pdfFileName], "./pdfs/final.pdf");
            fs.unlink(pdfFileName, (err) => {
              if (err) throw err;
              console.log(`${pdfFileName} was deleted`);
            });
            globalmessagenumber++;
          }
      }
    }
    else{
      for (messagenumber = 0; messagenumber < 20; messagenumber++) {//loop 0-19 for every message
        $('.progress-bar').text(`${barvalue}%`);
        $('.progress-bar').css('width', barvalue+'%').attr('aria-valuenow', barvalue);
        var barvalue = (((globalmessagenumber / (pages * 20)) * 100));
        barvalue = barvalue.toFixed(1);
        console.log(barvalue);
        $('.status').text(`Status: Extracting page ${pagenumber+1} and message ${messagenumber+1}`);
        await page.goto(`https://www.roblox.com/my/messages/#!/inbox?page=${pagenumber}&messageIdx=${messagenumber}`);//go to that message
        var pdfFileName =  `./pdfs/page_page_${pagenumber}_number${messagenumber}.pdf`;// PDF address
        await page.pdf({ path: pdfFileName, format: 'A4' });//make the PDF
        await mergeMultiplePDF(["./pdfs/final.pdf", pdfFileName], "./pdfs/final.pdf");
        fs.unlink(pdfFileName, (err) => {
          if (err) throw err;
          console.log(`${pdfFileName} was deleted`);
        });
        globalmessagenumber++;
      }
    }
  }
  $('.status').text("Status: Done!");
}

const mergeMultiplePDF = (pdfFiles,filename,message) => { //List of PDF Files and Output filename and message
  return new Promise((resolve, reject) => {
      merge(pdfFiles,filename,function(err){

          if(err){
              console.log(err);
              $('.status').text(err);
              reject(err)
          }
          $('.status').text(message);
          console.log('Success');
          resolve()
      });
  });
};

module.exports = {
  login: login,
  pagetopdf:pagetopdf
}