export async function yieldMainThread(): Promise<void> {
    await new Promise((resolve) => {
        setTimeout(resolve, 0);
    });
}
