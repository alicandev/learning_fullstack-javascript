import express from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import assert from 'assert';
import config from '../config';

let mdb;
MongoClient.connect(config.mongodbUri, (err, db) => {
  assert.equal(null, err);
  mdb = db;
});

const router = express.Router();

router.get('/contests', (req, res) => {
  let contests = {};
  mdb.collection('contests')
    .find({})
    .project({ //choose which fields you want back
      categoryName: 1,
      contestName: 1,
    })
    .each((err, contest) => {
      assert.equal(null, err);
      if (!contest) { //no more contests
        res.send({ contests });
        return;
      }
      contests[contest._id] = contest;
    });
});

router.get('/names/:nameIds', (req, res) => {
  const nameIds = req.params.nameIds.split(',').map(ObjectID);
  let names = {};
  mdb.collection('names')
    .find({ _id: { $in: nameIds } })
    .each((err, name) => {
      assert.equal(null, err);
      if (!name) { //no more contests
        res.send({ names });
        return;
      }
      names[name._id] = name;
    });
// }, 4000);
});

router.get('/contests/:contestId', (req, res) => {
  mdb.collection('contests')
    .findOne({ _id: ObjectID(req.params.contestId) })
    .then(contest => res.send(contest))
    .catch(error => {
      console.log(error);
      res.status(404).send('Bad Requests');
    }); 
});

router.post('/names', (req, res) => {
  const contestId = ObjectID(req.body.contestId);
  const name = req.body.newName;
  mdb.collection('names')
    .insertOne({ name })
    .then(result =>
      mdb.collection('contests')
        .findAndModify(
          { _id: contestId },
          [],
          { $push: { nameIds: result.insertedId } },
          { new: true }
        ).then(doc =>
          res.send({
            updatedContest: doc.value,
            newName: { _id: result.insertedId, name }
          })
        )
    ).catch(error => {
      console.log(error);
      res.status(404).send('Bad Requests');
    });
});

export default router;