import { Router } from "express";
import { authMiddleWare } from "../middleware";
import { Expense, Group, User } from "../models";
import mongoose from "mongoose";
import { updateMemberBalances } from "../services/expenseService";
import "mongoose";

const router = Router();

// Get Total Expense of Group
router.get("/:groupId", authMiddleWare, async (req, res) => {
  const groupId = req.params.groupId;
  const group = await Group.findById(groupId)
    .populate("members", {
      password: 0,
    })
    .lean({ virtuals: true });
  if (!group?._id) {
    res.status(404).send("Group not found");
  }
  const totalExpenses = await Expense.countDocuments({ group: group._id });
  res.send({ ...group, totalExpenses });
});

// Add Group | Create New Group
router.post("/", authMiddleWare, async (req, res) => {
  const group = new Group({
    name: req.body.name,
    description: req.body.description,
    members: req.body.members,
  });
  await group.save();

  res.send(group);
});

// Get all groups from memberId
router.get("/member/:memberId", authMiddleWare, async (req, res) => {
  const memberId = req.params.memberId;
  let groups: any = await Group.find({ members: memberId }).lean();
  groups = groups.map(async (group) => {
    const totalExpenses = await Expense.countDocuments({ group: group._id });
    return {
      ...group,
      totalExpenses,
    };
  });
  groups = await Promise.all(groups);
  res.send(groups);
});

// Delete member
router.delete(
  "/:groupId/member/:memberId",
  authMiddleWare,
  async (req, res) => {
    const groupId = req.params.groupId;
    const memberId = req.params.memberId;
    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).send("you're not part of group or group is deleted");
    }
    const index = group.members.indexOf(
      memberId as unknown as mongoose.Types.ObjectId
    );
    if (index > -1) {
      group.members.splice(index, 1);
      await group.save();
    }

    const expenses = await Expense.find({ group: groupId });

    const updatedMemberBalances = await updateMemberBalances(
      expenses,
      group.members
    );

    await Promise.all(
      updatedMemberBalances.map(async (memberBalances) => {
        await Expense.updateOne(
          { _id: memberBalances.expenseId },
          { $set: { membersBalance: memberBalances.membersBalance } }
        );
      })
    );
    res.send(group);
  }
);

// Add New Member to Group
router.post("/:groupId/member/:memberId", authMiddleWare, async (req, res) => {
  const groupId = req.params.groupId;
  const memberId = req.params.memberId;
  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404).send("you're not part of group or group is deleted");
  }
  const member = await User.findById(memberId);
  if (!member) {
    res.status(404).send("Member not found");
  }
  group.members.push(memberId as unknown as mongoose.Types.ObjectId);

  const expenses = await Expense.find({ group: groupId });

  const updatedMemberBalances = await updateMemberBalances(
    expenses,
    group.members
  );

  await Promise.all(
    updatedMemberBalances.map(async (memberBalances) => {
      await Expense.updateOne(
        { _id: memberBalances.expenseId },
        { $set: { membersBalance: memberBalances.membersBalance } }
      );
    })
  );

  await group.save();
  res.send(group);
});

// Delete group
router.delete("/:groupId", authMiddleWare, async (req, res) => {
  const groupId = req.params.groupId;
  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404).send("you're not part of group or group is deleted");
  }

  const expenses = await Expense.deleteMany({
    group: new mongoose.Types.ObjectId(group._id),
  });
  const result = await Group.deleteOne({ _id: groupId });

  return res.send("Group Deleted");
});

export default router;
