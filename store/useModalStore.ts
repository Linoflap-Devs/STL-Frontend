import { create } from "zustand";

type ModalType = "create" | "view" | "editlog" | null;

interface ModalState {
  modalOpen: boolean;
  modalType: ModalType;
  selectedData: any;
  
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modalOpen: false,
  modalType: null,
  selectedData: null,

  openModal: (type, data = null) =>
    set({ modalOpen: true, modalType: type, selectedData: data }),
  closeModal: () => set({ modalOpen: false, modalType: null, selectedData: null }),
}));
