"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDatabase = void 0;
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../db");
const updateDatabase = async (req, res) => {
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
    // Upsert data into table animal_sheltername_address
    data.map(async (item) => {
        await db_1.prisma.animal_sheltername_address.upsert({
            where: { sheltername: item.shelter_name },
            update: { address: item.shelter_address, tel: item.shelter_tel }, // update data searched
            create: {
                // create data if not existed
                sheltername: item.shelter_name,
                address: item.shelter_address,
                tel: item.shelter_tel,
            },
        });
    });
    const { count: dataUpdatedNumber } = await db_1.prisma.animal.createMany({
        data: animals,
        skipDuplicates: true, // skip repeated data
    });
    return dataUpdatedNumber;
};
exports.updateDatabase = updateDatabase;
