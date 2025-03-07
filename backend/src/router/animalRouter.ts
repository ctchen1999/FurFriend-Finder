import express from 'express';
import { getAnimals, updateTableAnimal } from '../Controller/animalController';

const router = express.Router();

router.route('/').post(updateTableAnimal).get(getAnimals);

export { router };
