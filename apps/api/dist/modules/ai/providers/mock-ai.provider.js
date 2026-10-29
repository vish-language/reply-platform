export class MockAIProvider {
    async generateReply(input) {
        return {
            content: "Mock reply",
            provider: "mock",
            model: "mock-model",
        };
    }
}
//# sourceMappingURL=mock-ai.provider.js.map