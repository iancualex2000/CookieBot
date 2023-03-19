const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.connect({browserURL: "http://127.0.0.1:9222"});
    const page = await browser.newPage();
    await Promise.all([
        page.goto("http://orteil.dashnet.org/cookieclicker/"),
        await page.waitForNetworkIdle()
    ]);

    const getCookies = async () => {
        const getNumOfCookies = async () => {
            const cookiesTitleElement = (await page.$x("//div[@id='cookies']"))[0];
            const numOfCookies = await page.evaluate((elem) => {
                return elem.innerText.split(" ")[0];
            }, cookiesTitleElement);
            return numOfCookies.replaceAll(',','');
        }

       

        const cookiesNumber = getNumOfCookies().then(numOfCookies => {
            return numOfCookies;
        });
        const numberOfCookiesToFloat = parseFloat(await cookiesNumber);
        console.log("Cookies: "+numberOfCookiesToFloat);
        return numberOfCookiesToFloat;
    
    }

    const getProductPrices = async (i) => {
        const getPriceValue = async () => {
            const productPrice = (await page.$x(`//span[@id='productPrice${i}']`))[0];
            if (productPrice) {
                const productPriceValue = await page.evaluate((elem) => {
                    return elem.innerText.split(' ')[0];
                }, productPrice);
                const productPriceToFloat = parseFloat(productPriceValue.replaceAll(",", ""));
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
        const getPriceValue = async () => {
            await page.hover(`#upgrade${i}`);
            const tooltipCrate = (await page.$x("//div[@id='tooltipCrate']//span[@class='price']"))[0];
            if(tooltipCrate){
                const upgradePrice = await page.evaluate((elem) => {
                    return elem.innerText.split(' ')[0];
                }, tooltipCrate);
                const upgradePriceToFloat = parseFloat(upgradePrice.replaceAll(',',''));
                console.log('Upgrade Price: '+upgradePriceToFloat);
                return upgradePriceToFloat;
            }else{
                console.log(`Could not find upgradePrice${i} element`);
                return 0;
            }
        }

        const priceNumber = getPriceValue().then(priceNumber => {
            return priceNumber;
        });

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
        const productLevel = getProductLevelValue().then(productLevel => {
            return productLevel;
        });
        return productLevel;
    }

    const checkIfMillion = async () => {
        const cookiesTitleElement = (await page.$x("//div[@id='cookies']"))[0];
        const million = await page.evaluate((elem) => {
            return elem.innerText.replaceAll("\n", " ").split(" ")[1];
        }, cookiesTitleElement);
        console.log(million);
        if(million === "million"){
            return true;
        }
    }

  
    const buyStuff = async () => {
        const checkProductsUnlocked = await page.$x("//div[contains(@class,'product unlocked')]");
        const checkProductsAvailable = await page.$x("//div[@class='product unlocked enabled']");
        const checkUpgrades = await page.$x("//div[@class='crate upgrade enabled']");
        if(checkUpgrades.length > 0){
            
                for(let i=0;i<checkUpgrades.length;i++){
                   const upgradePrice = await getUpgradePrices(i);
                   const cookies = await getCookies();
                   const check = await checkIfMillion();
                   if(checkIfMillion === true){
                        const newUpgradePrice = upgradePrice/1000000;
                        console.log(newUpgradePrice);
                        if(cookies>=newUpgradePrice){
                            const buyUpgrade = async () => {await page.click(`#upgrade${i}`)};
                            await buyUpgrade();
                            console.log("Upgrade bought");
                        }
                    }else{
                        if(cookies>=upgradePrice){
                            const buyUpgrade = async () => {await page.click(`#upgrade${i}`)};
                            await buyUpgrade();
                            console.log("Upgrade bought");
                        }
                    }
                    
                }
           
            
        }else if(checkProductsUnlocked.length > 0){
            let lowestLevelProductIndex = 0;
            let lowestLevel = Number.MAX_SAFE_INTEGER;
            const buyProduct = async (index) => {await page.click(`#product${index}`, {delay: 10})};
            const cookies = await getCookies();
            
                for(let i = 0;i<checkProductsUnlocked.length;i++){
                    const priceNumbers = await getProductPrices(i);
                    const productLevels = await getProductLevels(i);
                    if(cookies>=priceNumbers){
                    
                        if(productLevels === ''){
                            await buyProduct(i);
                            console.log("Nan Producted buyed");

                        }else if(productLevels !== '' && productLevels < lowestLevel){
                            lowestLevel = productLevels;
                            lowestLevelProductIndex = i;
                            await buyProduct(lowestLevelProductIndex);
                        }
                    }
                    
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