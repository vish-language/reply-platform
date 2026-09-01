export type GenerateReplyInput = {

  comment: string;

  tone: string;

  language: string;

  instructions?: string | null;

};


export type GenerateReplyResult = {

  content: string;

  provider: string;

  model: string;

};