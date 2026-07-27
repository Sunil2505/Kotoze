 export default class SlugService {
  /**
   * Convert text into URL-friendly slug.
   *
   * Example:
   * "Apple iPhone 16 Pro" -> "apple-iphone-16-pro"
   */
  static generate(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  /**
   * Generate a unique slug.
   *
   * Example:
   * apple-iphone
   * apple-iphone-1
   * apple-iphone-2
   */
  static async generateUnique<T>(
    model: {
      exists(filter: Record<string, unknown>): Promise<unknown>;
    },
    text: string
  ): Promise<string> {
    const baseSlug = this.generate(text);

    let slug = baseSlug;
    let counter = 1;

    while (await model.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}