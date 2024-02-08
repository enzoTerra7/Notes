import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";
import { useState } from "react";

interface NoteCardProps {
  note: {
    date: Date;
    content: string;
    id: string;
  };
  onNoteDeleted: (id: string) => void;
}

export function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  function handleOpenModal() {
    setIsOpenDialog(true);
  }

  function handleCloseModal() {
    setIsOpenDialog(false);
  }

  return (
    <Dialog.Root open={isOpenDialog}>
      <Dialog.Trigger asChild>
        <button
          className="transition-all duration-300 rounded-md text-left bg-neutral-800 p-5 flex flex-col gap-3 overflow-hidden relative hover:ring-2 hover:ring-neutral-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none"
          onClick={handleOpenModal}
        >
          <span className="text-sm font-medium text-neutral-300 first-letter:uppercase">
            {formatDistanceToNow(note.date, {
              locale: ptBR,
              addSuffix: true,
            })}
          </span>
          <p className="text-sm leading-6 text-neutral-400">{note.content}</p>
          <div className="absolute bottom-0 h-1/2 left-0 right-0 bg-gradient-to-b from-black/0 to-black/60 pointer-events-none" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/70" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[95vw] md:max-w-[70vw] xl:max-w-[65vw] h-[60svh] 2xl:max-w-2xl w-full z-10 bg-neutral-700 rounded-xl flex flex-col outline-none overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
          <Dialog.Close
            className="absolute right-4 top-4 transition-colors duration-300 hover:bg-neutral-600 p-1 rounded-full text-neutral-400"
            onClick={handleCloseModal}
          >
            <X className="size-5" />
          </Dialog.Close>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-sm font-medium text-neutral-300 first-letter:uppercase">
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>
            <p className="text-sm leading-6 text-neutral-400">{note.content}</p>
          </div>
          <button
            className="w-full group bg-neutral-800 py-4 text-center text-small text-neutral-300 outline-none font-medium"
            onClick={() => onNoteDeleted(note.id)}
          >
            Deseja{" "}
            <span className="text-red-600 group-hover:underline">
              apagar esta nota?
            </span>
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
