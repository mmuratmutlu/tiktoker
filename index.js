var ffmpeg = require('fluent-ffmpeg');
const { post } = require('request');
const { music, hashtag, getVideoMeta } = require('tiktok-scraper');
const TikTokScraper = require('tiktok-scraper');
const fetch = require('node-fetch');
const { exec, spawn } = require('child_process');
const fs = require('fs')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
async function downloadByUrl(url, callback) {
    var cliprocess = `tiktok-scraper video ${url} -d`
    exec(cliprocess, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        } else {
            console.log('stdout', stdout);
            callback(stdout)
        }

    });
}
function downloadAndConcatH(link1, link2) {

    downloadByUrl(link1, (location1) => {
        downloadByUrl(link2, (location2) => {
            console.log('GUmbeGABR',location1.split('/')[5].trim())
            concatH(location1.split('/')[5].trim(), location2.split('/')[5].trim(), Math.floor(Math.random() * 99999) + 'vs' + Math.floor(Math.random() * 99999999))
        })
    })
}
async function getVideosByMusic(id) {

    const posts = await TikTokScraper.music(id, {
        number: 2,
        sessionList: ['sid_tt=58ba9e34431774703d3c34e60d584475;']
    });

    downloadByUrl(posts.collector[0].webVideoUrl, (callback) => {
        downloadByUrl(posts.collector[1].webVideoUrl, (callback) => {
            concatH(posts.collector[0].id + '.mp4', posts.collector[1].id + '.mp4', posts.collector[0].id + 'vs' + posts.collector[1].id)
        })
    })
    //

}
function concatH(path1, path2, outputName) {
    ffmpeg()

        .input(path1)
        .input(path2)
        .complexFilter([
            '[0:a]volume=1',
            '[0:v]scale=540:960[0scaled]',
            '[1:v]scale=540:960[1scaled]',
            '[0scaled]pad=1080:960[0padded]',
            '[0padded][1scaled]overlay=shortest=1:x=540[output]',

        ])
        .outputOptions([
            '-map [output]'
        ])
        .output(outputName + '.mp4')
        .on("error", function (er) {
            console.log("error occured: " + er.message);
        })
        .on("end", function () {

            fs.unlinkSync(path1)
            fs.unlinkSync(path2)

        })
        .run();



}
//downloadAndConcatH('https://www.tiktok.com/@dudareisb/video/6910976812952587525?lang=tr-TR', 'https://www.tiktok.com/@arnaldomangini/video/6910264280751328514?lang=tr-TR')

//getVideosByMusic('6905083228357757698')
//await page.waitForSelector('.profile',{timeout:480000})

(async () => {
    puppeteer.launch({ headless: false }).then(async browser => {
        console.log('Running tests..')
        const page = await browser.newPage()
        await page.goto('https://bot.sannysoft.com')
        await page.waitFor(5000)
        await page.screenshot({ path: 'testresult.png', fullPage: true })
      //  await browser.close()
        console.log(`All done, check the screenshot. ✨`)
      })

  //await browser.close();
})();