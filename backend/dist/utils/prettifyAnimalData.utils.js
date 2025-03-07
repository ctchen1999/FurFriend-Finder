"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prettifyAnimalData = (data) => {
    let textMsg = '';
    const numOfData = data.length;
    if (numOfData === 0) {
        textMsg +=
            '1、今日您所在的地區沒有新增動物\n2、您輸入的品種並未存在資料庫\n3、您輸入的地點不是台灣縣市';
    }
    data.forEach((animal, idx) => {
        animal.variety = animal.variety.replace(/\s/g, '');
        textMsg += `${idx + 1}, ${animal.variety} | ${animal.sheltername} | ${animal.photo}\n `;
    });
    return textMsg;
};
exports.default = prettifyAnimalData;
