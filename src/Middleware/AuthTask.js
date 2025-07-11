exports.TaskAuth = (req, res ,next  ) => {
  try {
    const Data = req.body;
    const { title, description, userId } = Data;

    if (!title ) { return res.status(400).send({ status:false , msg: 'tile is required'  })    }
    if (!description ) { return res.status(400).send({ status:false , msg: 'description is required'  })    }
    if (!userId ) { return res.status(400).send({ status:false , msg: 'userId is required'  })    }

    next()

  } catch (e) {
    return res.status(500).send({ status: false, msg: e.message });
  }
};
