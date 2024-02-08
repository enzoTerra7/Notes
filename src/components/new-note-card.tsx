import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

let speechRecognition: SpeechRecognition | null = null;

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [content, setContent] = useState("");
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  function handleOpenModal() {
    setIsOpenDialog(true);
  }

  function handleCloseModal() {
    setIsOpenDialog(false);
    if(isRecording) {
      handleStopRecording();
    }
    setContent("");
    setShouldShowOnboarding(true);
  }

  function handleStartEditor() {
    setShouldShowOnboarding(false);
  }

  function handleStartRecording() {
    const isSpeechRecognitionAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAvailable) {
      alert("Seu navegador não suporta essa funcionalidade!");
      toast.error("Seu navegador não suporta essa funcionalidade!");
      return;
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const result = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript) + " ";
      }, "");
      setContent(result);
    };

    speechRecognition.onerror = (error) => {
      console.log(error);
    };

    speechRecognition.start();
    setShouldShowOnboarding(false);

    setIsRecording(true);
  }

  function handleContentChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
    if (e.target.value === "") {
      setShouldShowOnboarding(true);
    }
  }

  function handleSaveNote() {
    if (content !== "") {
      setShouldShowOnboarding(true);
      onNoteCreated(content);
      toast.success("Nota criada com sucesso!");
      setContent("");
    }
    handleCloseModal();
    return;
  }

  function handleStopRecording() {
    speechRecognition?.stop();
    setIsRecording(false);
  }

  return (
    <Dialog.Root open={isOpenDialog}>
      <Dialog.Trigger
        onClick={handleOpenModal}
        className="flex flex-col text-left rounded-md bg-neutral-700 p-5 space-y-3 overflow-hidden outline-none hover:ring-2 hover:ring-neutral-600 focus-visible:ring-2 focus-visible:ring-lime-400 transition-all duration-300"
      >
        <span className="text-sm font-medium text-neutral-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-neutral-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/70" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[95vw] md:max-w-[70vw] xl:max-w-[65vw] h-[60svh] 2xl:max-w-2xl w-full z-10 bg-neutral-700 rounded-xl flex flex-col outline-none overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
          <Dialog.Close className="absolute right-4 top-4 transition-colors duration-300 hover:bg-neutral-600 p-1 rounded-full text-neutral-400 outline-none" onClick={handleCloseModal}>
            <X className="size-5" />
          </Dialog.Close>
          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-neutral-300">
                Adicionar nota
              </span>
              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-neutral-400">
                  Comece{" "}
                  <button
                    onClick={handleStartRecording}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    gravando uma nota
                  </button>{" "}
                  em áudio ou se preferir{" "}
                  <button
                    onClick={handleStartEditor}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    utilize somente texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  name="content"
                  value={content}
                  placeholder="Comece a digitar..."
                  className="bg-transparent placeholder:text-neutral-400 outline-none text-sm leading-6 text-neutral-300 resize-none flex-1"
                  onChange={handleContentChange}
                  required
                />
              )}
            </div>
            {isRecording ? (
              <button
                type="button"
                className="w-full bg-neutral-900 py-4 text-center text-small text-neutral-300 outline-none font-medium transition-colors duration-300 hover:text-neutral-100 disabled:pointer-events-none disabled:bg-neutral-400 disabled:text-neutral-600 flex items-center justify-center gap-4"
                onClick={handleStopRecording}
              >
                <div className="size-4 bg-red-400 rounded-full animate-pulse" />
                Gravando! (Clique para interromper)
              </button>
            ) : (
              <button
                type="button"
                disabled={content === ""}
                onClick={handleSaveNote}
                className="w-full bg-lime-400 py-4 text-center text-small text-lime-950 outline-none font-medium transition-colors duration-300 hover:bg-lime-500 disabled:pointer-events-none disabled:bg-neutral-400 disabled:text-neutral-600"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
