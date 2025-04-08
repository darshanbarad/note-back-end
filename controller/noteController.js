// import NoteModel from "../models/UserNoteSchema.js";

// // 🔹 Create Note
// export async function createNote(req, res) {
//   const userId = req.user.userId;

//   try {
//     const Note = new NoteModel({
//       title: req.body.title,
//       content: req.body.content,
//       category: req.body.category,
//       author: userId,
//       isPublic: req.body.isPublic,
//       noteDate: req.body.noteDate,
//       reminder: req.body.reminder,
//     });

//     const userNote = await Note.save();
//     res.status(200).json({ message: "Note created successfully", userNote });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating note", error });
//   }
// }

// export async function getUserNote(req, res) {
//   try {
//     const userId = req.user.userId;
//     const {
//       search,
//       sort,
//       order,
//       category,
//       startDate,
//       endDate,
//       isPublic,
//       noteDate,
//     } = req.query;

//     let query = { author: userId };

//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: "i" } },
//         { content: { $regex: search, $options: "i" } },
//       ];
//     }

//     if (category) {
//       query.category = category;
//     }

//     if (noteDate) {
//       const selectedDate = new Date(noteDate);
//       const nextDate = new Date(selectedDate);
//       nextDate.setDate(nextDate.getDate() + 1);
//       query.noteDate = { $gte: selectedDate, $lt: nextDate };
//     }

//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       end.setHours(23, 59, 59, 999);
//       query.createdAt = { $gte: start, $lte: end };
//     }

//     if (isPublic !== undefined) {
//       query.isPublic = isPublic === "true";
//     }

//     let sortOptions = {};
//     sortOptions[sort || "createdAt"] = order === "asc" ? 1 : -1;

//     // 🔹 USER NOTES
//     let userNotes = await NoteModel.find(query)
//       .populate("author", "name email")
//       .sort(sortOptions);

//     // 🔹 PUBLIC NOTES FROM OTHER USERS
//     let publicQuery = {
//       isPublic: true,
//       author: { $ne: userId },
//     };

//     if (search) {
//       publicQuery.$or = [
//         { title: { $regex: search, $options: "i" } },
//         { content: { $regex: search, $options: "i" } },
//       ];
//     }

//     if (category) {
//       publicQuery.category = category;
//     }

//     if (noteDate) {
//       const selectedDate = new Date(noteDate);
//       const nextDate = new Date(selectedDate);
//       nextDate.setDate(nextDate.getDate() + 1);
//       publicQuery.noteDate = { $gte: selectedDate, $lt: nextDate };
//     }

//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       end.setHours(23, 59, 59, 999);
//       publicQuery.createdAt = { $gte: start, $lte: end };
//     }

//     const publicNotes = await NoteModel.find(publicQuery)
//       .populate("author", "name email")
//       .sort(sortOptions);

//     res.status(200).json({
//       message: "Success",
//       userNotes,
//       publicNotes,
//     });
//   } catch (error) {
//     console.error("Error fetching notes:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// export async function getPublicNote(req, res) {
//   try {
//     const userNoteData = await NoteModel.find({ isPublic: true });
//     res.status(200).json({ message: "Success", userNoteData });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching public notes", error });
//   }
// }

// // 🔐 Secure Update Note

// export async function updateNote(req, res) {
//   try {
//     const { id } = req.params;
//     const userId = req.user.userId;

//     const note = await NoteModel.findById(id);
//     if (!note) {
//       return res.status(404).json({ message: "Note not found" });
//     }

//     // 🛡️ Ownership Check
//     if (note.author.toString() !== userId) {
//       return res.status(403).json({ message: "Unauthorized: Not your note" });
//     }

//     // ✅ Update fields
//     const fieldsToUpdate = [
//       "title",
//       "content",
//       "category",
//       "isPublic",
//       "noteDate",
//       "reminder",
//     ];

//     fieldsToUpdate.forEach((field) => {
//       if (req.body[field] !== undefined) {
//         note[field] = req.body[field];
//       }
//     });

//     await note.save();
//     res.status(200).json({ message: "Note updated successfully", note });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating note", error });
//   }
// }

// // 🔐 Secure Delete Note

// export async function deleteNote(req, res) {
//   try {
//     const { id } = req.params;
//     const userId = req.user.userId;

//     const note = await NoteModel.findById(id);
//     if (!note) {
//       return res.status(404).json({ message: "Note not found" });
//     }

//     if (note.author.toString() !== userId) {
//       return res.status(403).json({ message: "Unauthorized: Not your note" });
//     }

//     await NoteModel.findByIdAndDelete(id);
//     res.status(200).json({ message: "Note deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting note", error });
//   }
// }

// export async function deleteMultipleNotes(req, res) {
//   try {
//     const { ids } = req.body;
//     const userId = req.user.userId;

//     const notes = await NoteModel.find({ _id: { $in: ids } });

//     const userNoteIds = notes
//       .filter((note) => note.author.toString() === userId)
//       .map((note) => note._id);

//     const result = await NoteModel.deleteMany({ _id: { $in: userNoteIds } });

//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: "No notes found to delete" });
//     }

//     res.status(200).json({
//       message: "Notes deleted successfully",
//       deletedCount: result.deletedCount,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting multiple notes", error });
//   }
// }

import NoteModel from "../models/UserNoteSchema.js";

// 🔹 Create Note
export async function createNote(req, res) {
  const userId = req.user.userId;

  try {
    const Note = new NoteModel({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      author: userId,
      isPublic: req.body.isPublic,
      noteDate: req.body.noteDate,
    });

    const userNote = await Note.save();
    res.status(200).json({ message: "Note created successfully", userNote });
  } catch (error) {
    res.status(500).json({ message: "Error creating note", error });
  }
}

export async function getUserNote(req, res) {
  try {
    const userId = req.user.userId;
    const {
      search,
      sort,
      order,
      category,
      startDate,
      endDate,
      isPublic,
      noteDate,
    } = req.query;

    let query = { author: userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (noteDate) {
      const selectedDate = new Date(noteDate);
      const nextDate = new Date(selectedDate);
      nextDate.setDate(nextDate.getDate() + 1);
      query.noteDate = { $gte: selectedDate, $lt: nextDate };
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }

    if (isPublic !== undefined) {
      query.isPublic = isPublic === "true";
    }

    let sortOptions = {};
    sortOptions[sort || "createdAt"] = order === "asc" ? 1 : -1;

    // 🔹 USER NOTES
    let userNotes = await NoteModel.find(query)
      .populate("author", "name email")
      .sort(sortOptions);

    // 🔹 PUBLIC NOTES FROM OTHER USERS
    let publicQuery = {
      isPublic: true,
      author: { $ne: userId },
    };

    if (search) {
      publicQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      publicQuery.category = category;
    }

    if (noteDate) {
      const selectedDate = new Date(noteDate);
      const nextDate = new Date(selectedDate);
      nextDate.setDate(nextDate.getDate() + 1);
      publicQuery.noteDate = { $gte: selectedDate, $lt: nextDate };
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      publicQuery.createdAt = { $gte: start, $lte: end };
    }

    const publicNotes = await NoteModel.find(publicQuery)
      .populate("author", "name email")
      .sort(sortOptions);

    res.status(200).json({
      message: "Success",
      userNotes,
      publicNotes,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// 🔐 Secure Update Note
export async function updateNote(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const note = await NoteModel.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // 🛡️ Ownership Check
    if (note.author.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: Not your note" });
    }

    // ✅ Update fields
    const fieldsToUpdate = [
      "title",
      "content",
      "category",
      "isPublic",
      "noteDate",
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        note[field] = req.body[field];
      }
    });

    await note.save();
    res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    res.status(500).json({ message: "Error updating note", error });
  }
}

// 🔐 Secure Delete Note
export async function deleteNote(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const note = await NoteModel.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.author.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: Not your note" });
    }

    await NoteModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error });
  }
}

export async function deleteMultipleNotes(req, res) {
  try {
    const { ids } = req.body;
    const userId = req.user.userId;

    const notes = await NoteModel.find({ _id: { $in: ids } });

    const userNoteIds = notes
      .filter((note) => note.author.toString() === userId)
      .map((note) => note._id);

    const result = await NoteModel.deleteMany({ _id: { $in: userNoteIds } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No notes found to delete" });
    }

    res.status(200).json({
      message: "Notes deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting multiple notes", error });
  }
}
