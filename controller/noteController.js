import NoteModel from "../models/UserNoteSchema.js";

export async function createNote(req, res) {
  const userId = req.user.userId;

  try {
    const Note = new NoteModel({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      author: userId,
      isPublic: req.body.isPublic,
    });

    const userNote = await Note.save();
    res.status(200).json({ message: "Note created successfully", userNote });
  } catch (error) {
    res.status(500).json({ message: "Error creating note", error });
  }
}

// export async function getUserNote(req, res) {
//   try {
//     const userId = req.user.userId;
//     const { search, sort, order, category, startDate, endDate, isPublic } =
//       req.query;

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

//     if (isPublic !== undefined) {
//       query.isPublic = isPublic === "true";
//     }

//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);

//       if (!isNaN(start) && !isNaN(end)) {
//         end.setHours(23, 59, 59, 999);
//         query.createdAt = {
//           $gte: start,
//           $lte: end,
//         };
//       }
//     }

//     let sortOptions = {};
//     if (sort) {
//       sortOptions[sort] = order === "desc" ? -1 : 1;
//     } else {
//       sortOptions["createdAt"] = -1;
//     }

//     const userNoteData = await NoteModel.find(query)
//       .populate("author", "name email")
//       .sort(sortOptions);

//     res.status(200).json({ message: "Success", userNoteData });
//   } catch (error) {
//     console.error("Error fetching notes:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// export async function getUserNote(req, res) {
//   try {
//     const userId = req.user.userId;
//     const { search, sort, order, category, startDate, endDate, isPublic } =
//       req.query;

//     // Set the query for the user's own notes
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

//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);

//       if (!isNaN(start) && !isNaN(end)) {
//         end.setHours(23, 59, 59, 999);
//         query.createdAt = {
//           $gte: start,
//           $lte: end,
//         };
//       }
//     }

//     let sortOptions = {};
//     if (sort) {
//       sortOptions[sort] = order === "desc" ? -1 : 1;
//     } else {
//       sortOptions["createdAt"] = -1;
//     }

//     // Query for the user's own notes and public notes (if isPublic is true)
//     let notes = await NoteModel.find(query)
//       .populate("author", "name email")
//       .sort(sortOptions);

//     // If `isPublic` is not undefined, filter based on public visibility
//     if (isPublic !== undefined) {
//       notes = notes.filter((note) => note.isPublic === (isPublic === "true"));
//     }

//     // Fetch all public notes and append them to the user's notes (if they are logged in)
//     const publicNotes = await NoteModel.find({ isPublic: true }).populate(
//       "author",
//       "name email"
//     );

//     // Combine the user's notes (private/public) and the public notes
//     const combinedNotes = [...notes, ...publicNotes];

//     res.status(200).json({ message: "Success", userNoteData: combinedNotes });
//   } catch (error) {
//     console.error("Error fetching notes:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }
export async function getUserNote(req, res) {
  try {
    const userId = req.user.userId;
    const { search, sort, order, category, startDate, endDate, isPublic } =
      req.query;

    // Start by setting the query to fetch the user's notes
    let query = { author: userId };

    // If a search term is provided, filter notes based on title and content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    // Apply the category filter if provided
    if (category) {
      query.category = category;
    }

    // Apply the date range filter if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (!isNaN(start) && !isNaN(end)) {
        end.setHours(23, 59, 59, 999);
        query.createdAt = {
          $gte: start,
          $lte: end,
        };
      }
    }

    // Sort options if provided
    let sortOptions = {};
    if (sort) {
      sortOptions[sort] = order === "desc" ? -1 : 1;
    } else {
      sortOptions["createdAt"] = -1;
    }

    // Fetch the user's own notes (filtered by the search term, if provided)
    let userNotes = await NoteModel.find(query)
      .populate("author", "name email")
      .sort(sortOptions);

    // If `isPublic` is provided in the query, filter the public notes
    if (isPublic !== undefined) {
      userNotes = userNotes.filter(
        (note) => note.isPublic === (isPublic === "true")
      );
    }

    // Fetch all public notes, regardless of the logged-in user
    let publicNotes = [];
    if (!search) {
      publicNotes = await NoteModel.find({ isPublic: true })
        .populate("author", "name email")
        .sort(sortOptions);
    }

    // Combine the user's notes with the public notes, only if search is not applied
    const combinedNotes = search ? userNotes : [...userNotes, ...publicNotes];

    res.status(200).json({ message: "Success", userNoteData: combinedNotes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPublicNote(req, res) {
  try {
    console.log("Fetching public notes...");
    const userNoteData = await NoteModel.find({ isPublic: true });

    console.log("Public notes fetched:", userNoteData);

    res.status(200).json({ message: "Success", userNoteData });
  } catch (error) {
    console.error("Error fetching public notes:", error);
    res.status(500).json({ message: "Error fetching public notes", error });
  }
}
// Fetch Update  Notes
export async function updateNote(req, res) {
  try {
    const { id } = req.params;
    const note = await NoteModel.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.title = req.body.title;
    note.content = req.body.content;
    note.category = req.body.category;
    note.isPublic = req.body.isPublic;
    await note.save();

    res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    res.status(500).json({ message: "Error updating note", error });
  }
}

// 🗑️ Delete a Note
export async function deleteNote(req, res) {
  try {
    const { id } = req.params;
    const note = await NoteModel.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await NoteModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error });
  }
}

// 🚮 Delete Multiple Notes
export async function deleteMultipleNotes(req, res) {
  try {
    const { ids } = req.body;
    const result = await NoteModel.deleteMany({ _id: { $in: ids } });

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
