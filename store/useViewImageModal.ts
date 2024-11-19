import { create } from "zustand";

interface ViewImageModalStore {
  isOpen: boolean;
  currentImage: string;
  onOpen: () => void;
  onClose: () => void;
  setCurrentImage: (id: string) => void;
}

const useViewImageModal = create<ViewImageModalStore>((set) => ({
  isOpen: false,
  currentImage: "",
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setCurrentImage: (base64: string) => set({ currentImage: base64 }),
}));

export default useViewImageModal;
