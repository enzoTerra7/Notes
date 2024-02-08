import { ChangeEvent, useState } from "react";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";
import { v4 as uuidv4 } from "uuid";

type Note = {
  date: Date;
  content: string;
  id: string;
};

export function App() {
  const [search, setSearch] = useState<string>("");
  const [note, setNote] = useState<Array<Note>>(() => {
    const notesOnStorage = localStorage.getItem("notes");
    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }
    return [];
  });

  function onNoteCreated(content: string) {
    const newNote = {
      date: new Date(),
      content,
      id: uuidv4(),
    };
    const notesArray = [...note, newNote];
    setNote(notesArray);
    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteDeleted(id: string) {
    const newNote = note.filter((note) => note.id !== id);
    setNote(newNote);
    localStorage.setItem("notes", JSON.stringify(newNote));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  const filteredNotes = search
    ? note.filter((e) =>
        e.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      )
    : note;

  return (
    <h1 className="mx-auto p-4 xl:p-0 space-y-6 container my-12">
      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas"
          className="w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-neutral-500 outline-none"
          value={search}
          onChange={handleSearch}
        />
      </form>
      <hr className="border-neutral-700" />
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map((note) => (
          <NoteCard onNoteDeleted={onNoteDeleted} key={note.id} note={note} />
        ))}
      </div>
    </h1>
  );
}
