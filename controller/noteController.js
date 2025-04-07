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
      noteDate: req.body.noteDate,
      reminder: req.body.reminder,
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
      query.noteDate = {
        $gte: selectedDate,
        $lt: nextDate,
      };
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }

    let sortOptions = {};
    if (sort) {
      sortOptions[sort] = order === "desc" ? -1 : 1;
    } else {
      sortOptions["createdAt"] = -1;
    }

    let userNotes = await NoteModel.find(query)
      .populate("author", "name email")
      .sort(sortOptions);

    if (isPublic !== undefined) {
      userNotes = userNotes.filter(
        (note) => note.isPublic === (isPublic === "true")
      );
    }

    let publicNotes = [];
    if (!search) {
      publicNotes = await NoteModel.find({ isPublic: true })
        .populate("author", "name email")
        .sort(sortOptions);
    }

    const combinedNotes = search ? userNotes : [...userNotes, ...publicNotes];

    res.status(200).json({ message: "Success", userNoteData: combinedNotes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPublicNote(req, res) {
  try {
    const userNoteData = await NoteModel.find({ isPublic: true });
    res.status(200).json({ message: "Success", userNoteData });
  } catch (error) {
    res.status(500).json({ message: "Error fetching public notes", error });
  }
}

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
    note.noteDate = req.body.noteDate; 
    note.reminder = req.body.reminder; 

    await note.save();

    res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    res.status(500).json({ message: "Error updating note", error });
  }
}

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
