import { connectToDatabase } from "../../../util/mongodb";
var ObjectId = require('mongodb').ObjectId;

/*
export default function handler(req, res) {
  const {
    query: { pid },
  } = req

  res.end(`Post: ${pid}`)
}
*/

export default async (req, res) => {
  const {
    query: { pid },
  } = req

  const pidString = pid.toString();

  const movieId = new ObjectId(pidString); 
  
  const { db } = await connectToDatabase();
  const movie = await db
    .collection("movies")
    .find({"_id" : movieId})
    .sort({ metacritic: -1 })
    .limit(20)
    .toArray();
  
    //res.end(`Post: ${pid}`)
    res.json(movie);
};



