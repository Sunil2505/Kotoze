import Counter from "@/models/Counter";

export default class SequenceService {
  /**
   * Returns the next sequence number.
   */
  static async next(key: string): Promise<number> {
    const counter = await Counter.findOneAndUpdate(
      { key: key.toLowerCase() },
      { $inc: { value: 1 } },
      {
        new: true,
        upsert: true,
      }
    );

    return counter.value;
  }

  /**
   * Returns formatted sequence.
   * Example: SKU-000001
   */
  static async nextCode(
    key: string,
    prefix: string,
    padding = 6
  ): Promise<string> {
    const value = await this.next(key);

    return `${prefix}-${String(value).padStart(
      padding,
      "0"
    )}`;
  }
}