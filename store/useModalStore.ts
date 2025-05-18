import { create } from "zustand";
import { Operator, User } from "~/types/types";

type ModalType = "create" | "view" | "editlog" | "page" | null;

interface ModalState {
  modalOpen: boolean;
  modalType: ModalType;
  selectedData: any;
  
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
  setSelectedData: (data: User | Operator) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modalOpen: false,
  modalType: null,

  openModal: (type, data = null) =>
    set({ modalOpen: true, modalType: type, selectedData: data }),
  closeModal: () => set({ modalOpen: false, modalType: null, selectedData: null }),


  selectedData: null,
  setSelectedData: (data) => set({ selectedData: data }),
}));
