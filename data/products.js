const fs = require('fs'),
      path = require('path'),
      resolve = path.resolve,
      join = path.join;

const jsonDir = join(resolve(__dirname), 'json');

const PATHS = {
  products: 'products.json',
}
const DATA = {
  products: [],
}

const nextId = () => Object.keys(DATA.products).length + 1

let createTheseProducts = {
  'Weather sticker pack': {
    baseUrl: 'stickers/weather-sticker-pack',
    iconNames: {
      'stormy': 0,
      'windy': 1,
      'snowy': 5,
      'icy': 7,
      'haze': 21,
      'cloudy': 26,
      'sunny': 32,
      'moony': 33,
      'hot': 36,
      'muggy': 39,
      'na': 'na'
    }
  },
  'Essentials': {
    baseUrl: 'stickers/essentials',
    iconNames: {
      'alarm': 'alarm-1',
      'archive': 'archive-1',
      'fullBattery': 'battery-1',
      'emptyBattery': 'battery-4',
      'binoculars': 'binoculars',
      'briefcase': 'briefcase',
      'clock': 'clock',
      'calendar': 'calendar',
      'diamond': 'diamond',
      'dislike': 'dislike',
      'edit': 'edit',
      'file': 'file-1',
      'garbage': 'garbage-1',
      'home': 'home-1',
      'idea': 'idea'
    }
  }
}

Object.keys(createTheseProducts)
  .map(name => {
    const id = nextId();
    const desc = createTheseProducts[name];
    const baseUrl = desc.baseUrl;
    const iconNames = desc.iconNames;

    let pack = {
      id, name,
      products: []
    }

    Object.keys(iconNames).map((name, idx) => {
      pack.products.push({
        id: name,
        productId: id,
        name,
        thumbnail: `${baseUrl}/${iconNames[name]}.png`,
        fullPath: `${baseUrl}/${iconNames[name]}.png`
      })
    })

    DATA.products.push(pack);
})

Object.keys(PATHS).forEach(name => {
  console.log(`${name}`, join(jsonDir, `${name}.json`));
  fs.open(join(jsonDir, `${name}.json`), 'w+', (err, fd) => {
    fs.write(fd, JSON.stringify(DATA[name]));
    fs.close(fd);
  })
})

module.exports = {DATA};
// console.log(JSON.stringify(products));
