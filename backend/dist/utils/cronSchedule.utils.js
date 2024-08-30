"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronSchedule = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../db");
exports.cronSchedule = node_cron_1.default.schedule('0 0 * * *', async () => {
    // execute on every midnight
    try {
        const response = await axios_1.default.get('https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL');
        const data = response.data;
        const animals = data.map((item) => ({
            animal_id: item.animal_id,
            kind: item.animal_kind,
            variety: item.animal_Variety,
            sex: item.animal_sex,
            age: item.animal_age,
            bodytype: item.animal_bodytype,
            colour: item.animal_colour,
            status: item.animal_status,
            remark: item.animal_remark,
            opendate: item.animal_opendate ? new Date(item.animal_opendate) : null,
            createtime: item.animal_createtime
                ? new Date(item.animal_createtime)
                : null,
            photo: item.album_file,
            sheltername: item.shelter_name,
        }));
        const { count: updateCount } = await db_1.prisma.animal.createMany({
            data: animals,
            skipDuplicates: true, // 如果有重複的資料，可以選擇跳過
        });
        console.log(`${updateCount} data were updated in table Animal`);
    }
    catch (error) {
        console.error('Something went wrong upon updating');
    }
}, {
    scheduled: true, // 是否立即執行
    timezone: 'Asia/Taipei', // 時區
});
