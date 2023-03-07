/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/montlimartbrand');
const circlesportswear = require('./eshops/circlesportswearbrand');
const fs = require('fs');

function writeToFile(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

async function sandbox (eshop = 'circlesportswear') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    switch(eshop){
      case 'dedicated':
        const dedicatedLinks = require('./dedicatedbrand_links.json');
        const dedicatedProducts = [];

        for (let link of dedicatedLinks) {
          const data = await dedicatedbrand.scrape(link);
          dedicatedProducts.push(...data);
        }

        writeToFile('data_dedicatedbrand.json', dedicatedProducts);
        console.log(dedicatedProducts);
        break;

      case 'montlimart':
        const montlimartLinks = require('./montlimart_links.json');
        const montlimartProducts = [];

        for (let link of montlimartLinks) {
          const data = await montlimartbrand.scrape(link);
          montlimartProducts.push(...data);
        }

        writeToFile('data_montlimart.json', montlimartProducts);
        console.log(montlimartProducts);
        break;

      case 'circlesportswear':
        const circlesportswearProducts = [];
        const data = await circlesportswear.scrape('https://shop.circlesportswear.com/collections/all');
        circlesportswearProducts.push(...data);

        writeToFile('data_circlesportswear.json', circlesportswearProducts);
        console.log(circlesportswearProducts);
        break;

      default:
        console.log(`Eshop ${eshop} not supported`);
        process.exit(1);
    }

    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;
sandbox(eshop);

