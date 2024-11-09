import { create } from "zustand";

interface DeletePostModalStore {
  isOpen: boolean;
  currentPostId: string;
  onOpen: () => void;
  onClose: () => void;
  setCurrentPostId: (id: string) => void;
}

const useDeletePostModal = create<DeletePostModalStore>((set) => ({
  isOpen: false,
  currentPostId: "",
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setCurrentPostId: (id: string) => set({ currentPostId: id }),
}));

export default useDeletePostModal;
