import { Timestamp } from "firebase/firestore";

export interface Welcome {
    candidates:    Candidate[];
    usageMetadata: UsageMetadata;
    modelVersion:  string;
}

export interface Candidate {
    content:      Content;
    finishReason: string;
    avgLogprobs:  number;
}

export interface Content {
    parts: Part[];
    role:  string;
}

export interface Part {
    text: string;
}

export interface UsageMetadata {
    promptTokenCount:        number;
    candidatesTokenCount:    number;
    totalTokenCount:         number;
    promptTokensDetails:     TokensDetail[];
    candidatesTokensDetails: TokensDetail[];
}

export interface TokensDetail {
    modality:   string;
    tokenCount: number;
}

export interface ChatMessage {
    text: string;
    sender: "bot" | "user";
    date: Date;
    state: "received";
    
  }

export interface FirestoreChat {
    id: string; // Opcional porque Firestore lo genera
    title: string;
    created_at: Timestamp; // Usa el tipo correcto para timestamp
    messages: ChatMessage[];
    userId: string;
}