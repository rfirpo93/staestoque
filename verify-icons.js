const fs = require('fs');
const path = require('path');
const icons = [
    'ArrowBack',
    'Search',
    'AttachMoney',
    'BarChart',
    'CalendarToday',
    'TrendingUp',
    'ShoppingCart',
    'Inventory'
];

const iconsPath = path.resolve(__dirname, 'node_modules/@mui/icons-material/esm');

icons.forEach(icon => {
    const iconPath = path.join(iconsPath, `${icon}.js`);
    if (!fs.existsSync(iconPath)) {
        console.error(`Ícone não encontrado: ${icon}`);
    } else {
        console.log(`Ícone encontrado: ${icon}`);
    }
});
