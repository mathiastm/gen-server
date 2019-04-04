const fs = require('fs');


const loadModel = (file) => {
    const name = file.substr(0, file.indexOf('.'));
    console.log(`Load Model : ${name}`);
    require(`./${name}`);
    return Promise.resolve(name);
};

const loadAllModels = () => {
    console.log('Load All Models');
    // Load all Models JS files of the models directory
    const files = fs.readdirSync('./app/models')
        .filter(file => (file !== 'modelsLoader.js' && file.substr(file.lastIndexOf('.') + 1) === 'js'));
    return Promise.all(files.map(f => loadModel(f)));
};

module.exports = loadAllModels;
