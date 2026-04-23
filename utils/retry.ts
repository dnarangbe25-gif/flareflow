/**
 * Implements exponential backoff for asynchronous tasks.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    // Log retry attempt
    console.warn(`Attempt failed, retrying in ${delay}ms... (${retries} left)`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Exponential backoff: increase delay for next attempt
    return withRetry(fn, retries - 1, delay * 2);
  }
}
