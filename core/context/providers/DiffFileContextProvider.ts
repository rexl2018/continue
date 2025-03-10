import {
  ContextItem,
  ContextProviderDescription,
  ContextProviderExtras,
} from "../../index.js";
import { BaseContextProvider } from "../index.js";

class DiffFileContextProvider extends BaseContextProvider {
  static description: ContextProviderDescription = {
    title: "difff",
    displayTitle: "GitDiffFile",
    description: "Diff this file to base",
    type: "normal",
  };

  async getContextItems(
    query: string,
    extras: ContextProviderExtras,
  ): Promise<ContextItem[]> {
    const diff = await extras.ide.getDiffForCurFile();
    return [
      {
        description: "The current git file diff",
        content:
          diff.length === 0
            ? "Git shows no current changes."
            : `\`\`\`git diff\n${diff.join("\n")}\n\`\`\``,
        name: "GitDiffFile",
      },
    ];
  }
}

export default DiffFileContextProvider;
