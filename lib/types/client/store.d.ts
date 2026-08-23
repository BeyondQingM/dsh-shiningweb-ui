export interface ShiningPanels {
    chatOpen: boolean;
    filesOpen: boolean;
}
export declare function useShiningStore(): ShiningPanels;
export declare function openChat(): void;
export declare function closeChat(): void;
export declare function toggleChat(): void;
export declare function openFiles(): void;
export declare function closeFiles(): void;
export declare function toggleFiles(): void;
