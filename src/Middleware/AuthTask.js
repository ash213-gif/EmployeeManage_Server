exports.TaskAuth = (req, res ,next  ) => {
  try {
    const Data = req.body;
    const { title, description ,assignedTo,deadline } = Data;

    if (!title ) { return res.status(400).send({ status:false , msg: 'title is required'  })    }
    if (!description ) { return res.status(400).send({ status:false , msg: 'description is required'  })}
    if (!assignedTo ) { return res.status(400).send({ status:false , msg: 'assignedTo is required'  })}
    if (!deadline ) { return res.status(400).send({ status:false , msg: 'deadline is required'  })}
    
    next()

  } catch (e) {
    return res.status(500).send({ status: false, msg: e.message });
  }
};
