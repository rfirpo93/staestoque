const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'node_modules/@mui/icons-material/esm/index.js');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        return console.error(err);
    }

    // Lista de ícones não encontrados
    const iconsToRemove = [
        'ArrowBack',
        'Search',
        'AttachMoney',
        'BarChart',
        'CalendarToday',
        'TrendingUp',
        'ShoppingCart',
        'Inventory'
    ];

    let result = data;

    // Remover exportações dos ícones não encontrados
    iconsToRemove.forEach(icon => {
        const regex = new RegExp(`export { default as ${icon} } from '.\/${icon}';\n`, 'g');
        result = result.replace(regex, '');
    });

    fs.writeFile(filePath, result, 'utf8', (err) => {
        if (err) return console.error(err);
        console.log('Referências a ícones inexistentes removidas com sucesso');
    });
});
