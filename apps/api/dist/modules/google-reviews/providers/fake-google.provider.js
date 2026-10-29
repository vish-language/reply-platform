export class FakeGoogleProvider {
    static async receiveReview(payload) {
        return {
            provider: "fake-google",
            review: payload,
            receivedAt: new Date(),
        };
    }
}
//# sourceMappingURL=fake-google.provider.js.map