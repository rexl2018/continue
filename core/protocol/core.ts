import { AutocompleteInput } from "../autocomplete/util/types";
import { ProfileDescription } from "../config/ConfigHandler";

import type {
  BrowserSerializedContinueConfig,
  ChatMessage,
  ContextItem,
  ContextItemWithId,
  ContextProviderWithParams,
  ContextSubmenuItem,
  DiffLine,
  FileSymbolMap,
  IdeSettings,
  LLMFullCompletionOptions,
  ModelDescription,
  ModelRoles,
  RangeInFile,
  SerializedContinueConfig,
  Session,
  SessionMetadata,
  SiteIndexingConfig,
  ToolCall,
} from "../";
import { ConfigResult } from "../config/load";

export type ProtocolGeneratorYield<T> = {
  done?: boolean;
  content: T;
};
export type ProtocolGeneratorType<Y> = AsyncGenerator<
  ProtocolGeneratorYield<Y>
>;

export type AsyncGeneratorYieldType<T> =
  T extends AsyncGenerator<infer Y, any, any>
    ? Y extends ProtocolGeneratorYield<infer PR>
      ? PR
      : never
    : never;
// export type AsyncGeneratorReturnType<T> =
//   T extends AsyncGenerator<any, infer R, any>
//     ? R extends ProtocolGeneratorYield<infer PR>
//       ? PR
//       : never
//     : never;

export type OnboardingModes =
  | "Local"
  | "Best"
  | "Custom"
  | "Quickstart"
  | "LocalAfterFreeTrial";

export interface ListHistoryOptions {
  offset?: number;
  limit?: number;
}

export type ToCoreFromIdeOrWebviewProtocol = {
  "update/selectTabAutocompleteModel": [string, void];

  // Special
  ping: [string, string];
  abort: [undefined, void];

  // History
  "history/list": [ListHistoryOptions, SessionMetadata[]];
  "history/delete": [{ id: string }, void];
  "history/load": [{ id: string }, Session];
  "history/save": [Session, void];
  "devdata/log": [{ tableName: string; data: any }, void];
  "config/addOpenAiKey": [string, void];
  "config/addModel": [
    {
      model: SerializedContinueConfig["models"][number];
      role?: keyof ModelRoles;
    },
    void,
  ];
  "config/newPromptFile": [undefined, void];
  "config/ideSettingsUpdate": [IdeSettings, void];
  "config/getSerializedProfileInfo": [
    undefined,
    {
      result: ConfigResult<BrowserSerializedContinueConfig>;
      profileId: string;
    },
  ];
  "config/deleteModel": [{ title: string }, void];
  "config/addContextProvider": [ContextProviderWithParams, void];
  "config/reload": [undefined, ConfigResult<BrowserSerializedContinueConfig>];
  "config/listProfiles": [undefined, ProfileDescription[]];
  "config/openProfile": [{ profileId: string | undefined }, void];
  "context/getContextItems": [
    {
      name: string;
      query: string;
      fullInput: string;
      selectedCode: RangeInFile[];
      selectedModelTitle: string;
    },
    ContextItemWithId[],
  ];
  "context/getSymbolsForFiles": [{ uris: string[] }, FileSymbolMap];
  "context/loadSubmenuItems": [{ title: string }, ContextSubmenuItem[]];
  "autocomplete/complete": [AutocompleteInput, string[]];
  "context/addDocs": [SiteIndexingConfig, void];
  "context/removeDocs": [Pick<SiteIndexingConfig, "startUrl">, void];
  "context/indexDocs": [{ reIndex: boolean }, void];
  "autocomplete/cancel": [undefined, void];
  "autocomplete/accept": [{ completionId: string }, void];
  "command/run": [
    {
      input: string;
      history: ChatMessage[];
      modelTitle: string;
      slashCommandName: string;
      contextItems: ContextItemWithId[];
      params: any;
      historyIndex: number;
      selectedCode: RangeInFile[];
    },
    ProtocolGeneratorType<string>,
  ];
  "llm/complete": [
    {
      prompt: string;
      completionOptions: LLMFullCompletionOptions;
      title: string;
    },
    string,
  ];
  "llm/listModels": [{ title: string }, string[] | undefined];
  "llm/streamComplete": [
    {
      prompt: string;
      completionOptions: LLMFullCompletionOptions;
      title: string;
    },
    ProtocolGeneratorType<string>,
  ];
  "llm/streamChat": [
    {
      messages: ChatMessage[];
      completionOptions: LLMFullCompletionOptions;
      title: string;
    },
    ProtocolGeneratorType<ChatMessage>,
  ];
  streamDiffLines: [
    {
      prefix: string;
      highlighted: string;
      suffix: string;
      input: string;
      language: string | undefined;
      modelTitle: string | undefined;
    },
    ProtocolGeneratorType<DiffLine>,
  ];
  "chatDescriber/describe": [
    {
      selectedModelTitle: string;
      text: string;
    },
    string | undefined,
  ];
  "stats/getTokensPerDay": [
    undefined,
    { day: string; promptTokens: number; generatedTokens: number }[],
  ];
  "stats/getTokensPerModel": [
    undefined,
    { model: string; promptTokens: number; generatedTokens: number }[],
  ];
  "tts/kill": [undefined, void];

  // Codebase indexing
  "index/setPaused": [boolean, void];
  "index/forceReIndex": [
    undefined | { dirs?: string[]; shouldClearIndexes?: boolean },
    void,
  ];
  "index/indexingProgressBarInitialized": [undefined, void];
  completeOnboarding: [
    {
      mode: OnboardingModes;
    },
    void,
  ];

  // File changes
  "files/changed": [{ uris?: string[] }, void];
  "files/opened": [{ uris?: string[] }, void];
  "files/created": [{ uris?: string[] }, void];
  "files/deleted": [{ uris?: string[] }, void];

  // Docs etc. Indexing. TODO move codebase to this
  "indexing/reindex": [{ type: string; id: string }, void];
  "indexing/abort": [{ type: string; id: string }, void];
  "indexing/setPaused": [{ type: string; id: string; paused: boolean }, void];
  "docs/getSuggestedDocs": [undefined, void];
  "docs/initStatuses": [undefined, void];

  addAutocompleteModel: [{ model: ModelDescription }, void];

  "profiles/switch": [{ id: string }, undefined];

  "auth/getAuthUrl": [undefined, { url: string }];
  "tools/call": [
    { toolCall: ToolCall; selectedModelTitle: string },
    { contextItems: ContextItem[] },
  ];
  "clipboardCache/add": [{ content: string }, void];
};
