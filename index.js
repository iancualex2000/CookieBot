const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.connect({browserURL: "http://127.0.0.1:9222"});
    const page = await browser.newPage();
    await Promise.all([
        page.goto("http://orteil.dashnet.org/cookieclicker/"),
        await page.waitForNetworkIdle()
    ]);

    const checkIfMillion = async () => {
        const cookiesTitleElement = (await page.$x("//div[@id='cookies']"))[0];
        const million = await page.evaluate((elem) => {
            return elem.innerText.replaceAll("\n", " ").split(" ")[1];
        }, cookiesTitleElement);
        if(million === "million"){
            return true;
        }
    }

    const getCookies = async () => {
        const getNumOfCookies = async () => {
            const cookiesTitleElement = (await page.$x("//div[@id='cookies']"))[0];
            const numOfCookies = await page.evaluate((elem) => {
                return elem.innerText.split(" ")[0];
            }, cookiesTitleElement);
            return numOfCookies.replaceAll(',','');
        }

       

        const cookiesNumber = await getNumOfCookies();
        const numberOfCookiesToFloat = parseFloat(await cookiesNumber);
        console.log("Cookies: "+numberOfCookiesToFloat);
        return numberOfCookiesToFloat;
    
    }

    const getProductPrices = async (i) => {
        const check = await checkIfMillion();
        const getPriceValue = async () => {
            const productPrice = (await page.$x(`//span[@id='productPrice${i}']`))[0];
            if (productPrice) {
                const productPriceValue = await page.evaluate((elem) => {
                    return elem.innerText.split(' ')[0];
                }, productPrice);
                const productPriceToFloat = parseFloat(productPriceValue.replaceAll(",", ""));
                if(check === true){
                    const productPriceIfMillion = productPriceToFloat/1000000;
                    console.log("Product price: "+productPriceIfMillion)
                    return productPriceIfMillion;
                }
                return productPriceToFloat;
            }
            else {
                console.log(`Could not find productPrice${i} element`);
                return 0;
            }
        }
    
        const priceNumber = await getPriceValue();
    
        return priceNumber;
    } 

    const getUpgradePrices = async (i) =>{
        const check = await checkIfMillion();
        const getPriceValue = async () => {
            await page.hover(`#upgrade${i}`);
            const tooltipCrate = (await page.$x("//div[@id='tooltipCrate']//span[@class='price']"))[0];
            if(tooltipCrate){
                const upgradePrice = await page.evaluate((elem) => {
                    return elem.innerText.split(' ')[0];
                }, tooltipCrate);
                const upgradePriceToFloat = parseFloat(upgradePrice.replaceAll(',',''));
                if(check === true){
                    const upgradePriceIfMillion = upgradePriceToFloat/1000000;
                    console.log('Upgrade Price: '+upgradePriceIfMillion);
                    return upgradePriceIfMillion;
                }
                console.log('Upgrade Price: '+upgradePriceToFloat);
                return upgradePriceToFloat;
            }else{
                console.log(`Could not find upgradePrice${i} element`);
                return 0;
            }
        }

        const priceNumber = await getPriceValue();

        return priceNumber;
    }

    const getProductLevels = async (i) => {
        const getProductLevelValue = async () => {
            const productLevel = (await page.$x(`//div[@id='productOwned${i}']`))[0];
            const productLevelValue = await page.evaluate((elem) => {
                return elem.innerText;
            }, productLevel);
            if(productLevelValue === ''){
                return productLevelValue;
            }else{
                const productLevelToInt = parseInt(productLevelValue);
                return productLevelToInt;
            }
        }
        const productLevel = await getProductLevelValue();
        return productLevel;
    }

 

  
    const buyStuff = async () => {
        const checkProductsUnlocked = await page.$x("//div[contains(@class,'product unlocked')]");
        const checkProductsAvailable = await page.$x("//div[@class='product unlocked enabled']");
        const checkUpgrades = await page.$x("//div[@class='crate upgrade enabled']");
        if(checkUpgrades.length > 0){
            
                for(let i=0;i<checkUpgrades.length;i++){
                   const upgradePrice = await getUpgradePrices(i);
                   const cookies = await getCookies();
                        if(cookies>=upgradePrice){
                            const buyUpgrade = async () => {await page.click(`#upgrade${i}`)};
                            await buyUpgrade();
                            console.log("Upgrade bought");
                        }
                }
           
            
        }else if(checkProductsUnlocked.length > 0){
            let lowestLevelProductIndex = 0;
            let lowestLevel = Number.MAX_SAFE_INTEGER;
            const buyProduct = async (index) => {await page.click(`#product${index}`, {delay: 10})};
            let cookies = await getCookies();
            let isPriorityProduct = false;
                for(let i = 0;i<checkProductsUnlocked.length;i++){
                    const priceNumbers = await getProductPrices(i);
                    const productLevels = await getProductLevels(i);

                    if(productLevels === ''){
                        isPriorityProduct = true;
                        if(cookies >= priceNumbers){
                            await buyProduct(i);
                            console.log("Product with priority bought");
                            cookies = await getCookies();
                        }else{
                            console.log("Not enough cookies for this product");
                        }
                    }

                    if(!isPriorityProduct && productLevels!=='' && productLevels < lowestLevel){
                        lowestLevel = productLevels;
                        lowestLevelProductIndex = i;
                    }
                    
                }

                if(!isPriorityProduct && cookies >= await getProductPrices(lowestLevelProductIndex)){
                    await buyProduct(lowestLevelProductIndex);
                    console.log("Product with lowest level bought");
                }else if(!isPriorityProduct){
                    console.log("Not Enough cookies for the lowest level product")
                }
            
            
        }else{
            console.log('No products or upgrades available')
        }
    }
    const clickOnBigCookie = () => {
        const click = async () => {await page.click("#bigCookie")};
        click();
    }

   let intervalId = null;

   const startCookieClicker = () => {
        intervalId = setInterval(() => {
            clickOnBigCookie();
        }, 50);

        setTimeout(() =>{
            clearInterval(intervalId);
            buyStuff().then(() => {
                setTimeout(startCookieClicker, 5000);
            });
        }, 15000);
   }

   startCookieClicker();

    
   

})();