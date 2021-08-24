const Express = require("express");
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
const { WorkOutLogModel } = require("../models");

// router.get("/practice", validateJWT, (req, res) => {
//   res.send("Hey! This is a practice route!");
// });

router.post("/", validateJWT, async (req, res) => {
  const { description, definition, result } = req.body.workoutlog;
  const { id } = req.user;
  const workOutLogEntry = {
    description,
    definition,
    result,
    owner: id,
  };
  try {
    const newWorkOutLog = await WorkOutLogModel.create(workOutLogEntry);
    res.status(200).json(newWorkOutLog);
  } catch (err) {
    res.status(500).json({ error: err });
  }
  WorkOutLogModel.create(workOutLogEntry);
});

router.get("/", async (req, res) => {
  try {
    const logEntries = await WorkOutLogModel.findAll();
    res.status(200).json(logEntries);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/:id", validateJWT, async (req, res) => {
  const workOutLogId = req.params.id;
  const userId = req.user.id;

  try {
    const userLogs = await WorkOutLogModel.findAll({
      where: {
        id: workOutLogId,
        owner: userId
      },
    });
    res.status(200).json(userLogs);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put('/:id', validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.workoutlog;
    const workOutLogId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: workOutLogId,
            owner: userId,
        }
    }

    const updatedWorkOutLog = {
        description: description,
        definition: definition,
        result: result
    }

    try {
        const update = await WorkOutLogModel.update(updatedWorkOutLog, query);
        res.status(200).json(update)
    } catch {
        res.status(500).json({ error: err })
    }
});

router.delete('/:id', validateJWT, async (req, res) => {
    const workOutLogId = req.params.id;
    const userId = req.user.id;

    try {
        const query = {
            where: {
                id: workOutLogId,
                owner: userId
            }
        }

        await WorkOutLogModel.destroy(query);
        res.status(200).json({ message: "Workout log has been removed." })
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

module.exports = router;
