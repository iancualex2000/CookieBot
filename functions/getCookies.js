// const puppeteer = require("puppeteer");


// const getCookies = async (page) => {
//     const getNumOfCookies = async () => {
//         const cookiesTitleElement = (await page.$x("//div[@id='cookies']"))[0]
//         const numOfCookies = await page.evaluate((elem) => {
//             return elem.innerText.split(" ")[0];
//         }, cookiesTitleElement);
//         return numOfCookies;
//     }
//     const cookiesNumber = getNumOfCookies().then(numOfCookies => {
//         return numOfCookies;
//     });
//     const numberOfCookiesToInt = parseInt(await cookiesNumber);
//     console.log(numberOfCookiesToInt);
//     return numberOfCookiesToInt;

// }

// module.exports = getCookies;


    
//     // await page.waitForXPath("//div[@id='cookies']");
//     // const bigCookie = (await page.$x("//div[@id='bigCookie']"))[0];

//     // const clickCookie = async () => {await page.click("#bigCookie")};
   
   
//     // setInterval(getNumOfCookies, 1000)
    

//     // const productNumbers = [0,1,2]

    

//     // const productPrices = async (productNumber) => {
//     //     let price = (await page.$x("//span[@id='productPrice"+productNumber+"']"))[0];
//     //     const actualPrice = await page.evaluate((elem) => {
//     //         return elem.innerText;
//     //     }, price);
//     //     return actualPrice;
//     // }
    
//     // const numberOfCookiesToInt = parseInt(await cookiesNumber);

//     //     productNumbers.map(async (product) => {
//     //         const productPrice = productPrices(product).then(actualPrice => {
//     //             return actualPrice;
//     //         })
//     //         const cookiesNumber = getNumOfCookies().then(numOfCookies => {
//     //             return numOfCookies;
//     //         })
            
//     //         const productPriceToInt = parseInt(await productPrice);
    
//     //         const buyProduct = async () => {await page.click('#productName' + product)}
            
            
//     //         if(productPriceToInt <= numberOfCookiesToInt){
//     //             buyProduct();
//     //         }else{
//     //             setInterval(clickCookie,1000);
//     //         }
    
            
//     //     })
    

  
    


    



// // $x("//div[@id='cookies']")[0].innerText
// //$x("//div[@id='productName1']") = Grandma
// //$x("//span[@id='productPrice1']") = Grandma Price
// // $x("//div[@id='productOwned1']") = level of product