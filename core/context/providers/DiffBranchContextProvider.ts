import {
  ContextItem,
  ContextProviderDescription,
  ContextProviderExtras,
} from "../../index.js";
import { BaseContextProvider } from "../index.js";

class DiffBranchContextProvider extends BaseContextProvider {
  static description: ContextProviderDescription = {
    title: "diffb",
    displayTitle: "GitDiffBranch",
    description: "Diff this branch to base",
    type: "normal",
  };

  async getContextItems(
    query: string,
    extras: ContextProviderExtras,
  ): Promise<ContextItem[]> {
    const diff = await extras.ide.getDiffForCurBranch();
    return [
      {
        description: "The current git branch diff",
        content:
          diff.length === 0
            ? "Git shows no current changes."
            : `\`\`\`git diff\n${diff.join("\n")}\n\`\`\``,
        name: "GitDiffBranch",
      },
    ];
  }
}

export default DiffBranchContextProvider;
