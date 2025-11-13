/*
Run this script once from Backend folder with:
  node scripts/fix-car-statuses.js
It will scan Uzsakymas collection, take the latest order per automobilis and set the automobilis.rezervuotas/parduotas flags accordingly.
*/
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import Uzsakymas from '../models/uzsakymasModelis.js';
import Automobilis from '../models/autoModelis.js';

async function main(){
  await mongoose.connect(process.env.URI);
  console.log('Connected to DB');

  // find distinct automobilis ids in orders
  const orders = await Uzsakymas.find({ automobilis: { $ne: null } }).sort({ createdAt: -1 }).exec();
  const latestByCar = new Map();
  for(const o of orders){
    const key = String(o.automobilis);
    if(!latestByCar.has(key)) latestByCar.set(key, o);
  }

  let i = 0;
  for(const [carId, order] of latestByCar){
    const s = (order.status || '').toString().toLowerCase();
    let update = { rezervuotas: false, parduotas: false };
    if (s.includes('įvykd')) update = { parduotas: true, rezervuotas: false };
    else if (s.includes('patvirt') || s.includes('rezerv')) update = { rezervuotas: true, parduotas: false };
    await Automobilis.findByIdAndUpdate(carId, update);
    i++;
  }

  console.log('Updated statuses for', i, 'cars');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});