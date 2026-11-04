/**
 * Human Preference Heuristics
 * 
 * Studies show humans exhibit strong non-uniform biases when choosing numbers:
 * - Round numbers (multiples of 10, 50, 100, 1000)
 * - Multiples of 5 and 10
 * - Repeated digits (11, 22, 111, 222, 333, 444, 555, 666, 777, 888, 999, etc.)
 * - Sequential digits (12, 23, 123, 234, 345, 1234, 4321, etc.)
 * - Symmetrical / Palindromic digits (121, 343, 1221, etc.)
 */

export class HumanPreference {
  /**
   * Calculates a preference weight score for a candidate number.
   * Higher score means humans are more statistically likely to have chosen this number.
   */
  public static getScore(n: number): number {
    if (n <= 0) return 0;
    let score = 0;
    const str = n.toString();
    const len = str.length;

    // 1. Triple or multiple identical digits (e.g. 111, 222, 777, 888, 999)
    if (this.isAllSameDigits(str)) {
      score += 120 + len * 15;
    }

    // 2. Exact round powers of 10 (10, 100, 1000, 10000)
    if (/^10+$/.test(str)) {
      score += 110;
    }

    // 3. Round hundreds or thousands (200, 500, 1500, 5000, etc.)
    if (n % 1000 === 0) {
      score += 90;
    } else if (n % 500 === 0) {
      score += 70;
    } else if (n % 100 === 0) {
      score += 60;
    } else if (n % 50 === 0) {
      score += 40;
    } else if (n % 10 === 0) {
      score += 30;
    } else if (n % 5 === 0) {
      score += 20;
    }

    // 4. Sequential ascending digits (e.g. 12, 123, 234, 1234)
    if (this.isAscendingSequence(str)) {
      score += 75 + len * 10;
    }

    // 5. Sequential descending digits (e.g. 321, 4321, 987)
    if (this.isDescendingSequence(str)) {
      score += 65 + len * 8;
    }

    // 6. Palindromic numbers (e.g. 121, 1331)
    if (len > 2 && this.isPalindrome(str) && !this.isAllSameDigits(str)) {
      score += 50;
    }

    // 7. Culturally popular lucky/notable numbers
    if (n === 7 || n === 42 || n === 69 || n === 77 || n === 666 || n === 777 || n === 1337) {
      score += 85;
    }

    return score;
  }

  /**
   * Checks if all characters in the string are identical (e.g. "111", "7777")
   */
  public static isAllSameDigits(s: string): boolean {
    if (s.length < 2) return false;
    for (let i = 1; i < s.length; i++) {
      if (s[i] !== s[0]) return false;
    }
    return true;
  }

  /**
   * Checks for strictly ascending sequential digits (e.g. "123", "3456")
   */
  public static isAscendingSequence(s: string): boolean {
    if (s.length < 2) return false;
    for (let i = 1; i < s.length; i++) {
      const prev = parseInt(s[i - 1], 10);
      const curr = parseInt(s[i], 10);
      if (curr !== prev + 1) return false;
    }
    return true;
  }

  /**
   * Checks for strictly descending sequential digits (e.g. "432", "987")
   */
  public static isDescendingSequence(s: string): boolean {
    if (s.length < 2) return false;
    for (let i = 1; i < s.length; i++) {
      const prev = parseInt(s[i - 1], 10);
      const curr = parseInt(s[i], 10);
      if (curr !== prev - 1) return false;
    }
    return true;
  }

  /**
   * Checks if string is a palindrome (e.g. "121", "2552")
   */
  public static isPalindrome(s: string): boolean {
    const reversed = s.split('').reverse().join('');
    return s === reversed;
  }

  /**
   * Finds the best candidate within a search window around the midpoint [minBound, maxBound].
   * The search window delta is bounded so binary search efficiency is maintained.
   */
  public static findBestBiasedCandidate(
    minBound: number,
    maxBound: number,
    midpoint: number,
    alreadyGuessed: (n: number) => boolean
  ): number | null {
    const rangeSpan = maxBound - minBound + 1;
    if (rangeSpan <= 2) {
      return null;
    }

    // Adaptive search radius around the midpoint:
    // up to 15% of the remaining range, minimum 2, capped at 30 to preserve fast convergence
    const radius = Math.min(30, Math.max(2, Math.floor(rangeSpan * 0.15)));
    const low = Math.max(minBound, midpoint - radius);
    const high = Math.min(maxBound, midpoint + radius);

    let bestCandidate: number | null = null;
    let highestScore = 0;

    for (let candidate = low; candidate <= high; candidate++) {
      if (alreadyGuessed(candidate)) continue;

      const score = this.getScore(candidate);

      // Score threshold to qualify as an intentional preference bias
      if (score >= 30) {
        // Distance penalty to balance heuristic vs binary search optimality
        const distFromMid = Math.abs(candidate - midpoint);
        const adjustedScore = score - (distFromMid * 1.5);

        if (adjustedScore > highestScore) {
          highestScore = adjustedScore;
          bestCandidate = candidate;
        }
      }
    }

    return bestCandidate;
  }
}

