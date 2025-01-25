import { ChatMessage, SlashCommand } from "../../index.js";
import { renderChatMessage } from "../../util/messageContent.js";

/**
// English version prompt
const prompt = `
     Review the following code, focusing on design issues, algorithm issues, error handling issues, null pointer issues, index overflow issues, concurrency issues, coding style issue, etc. Provide feedback with these guidelines:

     Tone: Ensure the feedback is clear and focused on practical improvements. Give the feedback in English
     Orderly Analysis: Address the code sequentially, from top to bottom, to ensure a thorough review without skipping any parts.
     Descriptive Feedback: Avoid referencing line numbers directly, as they may vary. Instead, describe the code sections or specific constructs that need attention, explaining the reasons clearly.
     Provide Examples: For each issue identified, offer an example of how the code could be improved or rewritten for better clarity, performance, or maintainability.
     Your response should be structured to first identify the issue, then explain why it’s a problem, and finally, offer a solution with example code.
     Concise Output: ignore the categories for which you haven't found any issue. It is not necessary to mention all categories.`;
 */

// Chinese version prompt
const prompt = `
请以以下准则审查代码
## 审查维度  
**可靠性**：空指针防御/索引越界/资源泄漏  
**健壮性**：异常处理/输入校验/边界条件  
**高效性**：算法效率/时间复杂度/并发竞争  
**可维护性**：代码规范/设计模式/冗余逻辑  
**扩展性**：类耦合度/接口抽象/配置硬编码  
**安全性**：注入风险/敏感数据处理  
（注：仅反馈实际发现问题维度）

## 审查规范
1. 表述标准 
   ✓ 问题定位：\`[代码特征] → [问题类型]\`（例：\`while循环条件 → 死锁风险\`）   
   ✓ 示例要求：提供必要的前后对比代码片段  

2. 分析流程 
   (1) 模块化扫描：按代码执行流分段审查  
   (2) 严重性分级：  
      🛑 致命错误 - 立即修复  
      ⚠️ 高危警告 - 建议修复  
      ℹ️ 优化建议 - 酌情处理  
   (3) 关联分析：识别模式化问题  

3. 输出模板
\`\`\` 
▌问题定位 [严重级别]  
[代码特征描述]  
◈ 问题本质：[技术术语定义]  
◈ 潜在影响：[具体异常场景推演]  
◈ 改进方案：  
    Before → [问题代码片段]  
    After  → [修复代码示例]  
\`\`\`
`;

function getLastUserHistory(history: ChatMessage[]): string {
  const lastUserHistory = history
    .reverse()
    .find((message) => message.role === "user");

  if (!lastUserHistory) {
    return "";
  }

  if (Array.isArray(lastUserHistory.content)) {
    return lastUserHistory.content.reduce(
      (acc: string, current: { type: string; text?: string }) => {
        return current.type === "text" && current.text
          ? acc + current.text
          : acc;
      },
      "",
    );
  }

  return typeof lastUserHistory.content === "string"
    ? lastUserHistory.content
    : "";
}

const ReviewMessageCommand: SlashCommand = {
  name: "review",
  description: "Review code and give feedback",
  run: async function* ({ llm, history }) {
    const reviewText = getLastUserHistory(history).replace("\\review", "");

    const content = `${prompt} \r\n ${reviewText}`;

    for await (const chunk of llm.streamChat(
      [{ role: "user", content: content }],
      new AbortController().signal,
    )) {
      yield renderChatMessage(chunk);
    }
  },
};

export default ReviewMessageCommand;
